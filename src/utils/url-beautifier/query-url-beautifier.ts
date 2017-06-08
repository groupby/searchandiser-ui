import { CONFIGURATION_MASK, SearchandiserConfig } from '../../searchandiser';
import { Beautifier, BeautifierConfig } from './interfaces';
import { Query, SelectedRangeRefinement, SelectedRefinement, SelectedValueRefinement } from 'groupby-api';
import * as queryString from 'query-string';

export class QueryUrlGenerator {

  config: BeautifierConfig;

  constructor({ config }: Beautifier) {
    this.config = config;
  }

  build(query: Query): string {
    const request = query.build();
    const uri = {
      path: [],
      query: {}
    };
    const origRefinements = [...request.refinements];

    // add query
    if (request.query) {
      uri.path.push(request.query);
    }

    if (this.config.useReferenceKeys) {
      const countMap = {};
      const { map, keys } = this.generateRefinementMap(origRefinements);

      // add refinements
      keys.forEach((key) => {
        const refinements = <SelectedRefinement[]>map[key];
        countMap[key] = refinements.length;
        refinements.map(this.convertToSelectedValueRefinement)
          .sort(this.refinementsComparator)
          .forEach((selectedValueRefinement) => uri.path.push(selectedValueRefinement.value));
      });

      // add reference key
      if (keys.length !== 0 || request.query) {
        let referenceKey = '';
        if (request.query) referenceKey += this.config.queryToken;
        keys.forEach((key) => referenceKey += key.repeat(countMap[key]));
        uri.path.push(referenceKey);
      }
    } else {
      // add refinements
      const valueRefinements = [];
      for (let i = origRefinements.length - 1; i >= 0; --i) {
        if (origRefinements[i].type === 'Value') {
          valueRefinements.push(...origRefinements.splice(i, 1));
        }
      }

      valueRefinements.map(QueryUrlGenerator.convertToSelectedValueRefinement)
        .sort(QueryUrlGenerator.refinementsComparator)
        .forEach((selectedValueRefinement) => {
          uri.path.push(selectedValueRefinement.value, selectedValueRefinement.navigationName);
        });
    }

    // add remaining refinements
    if (origRefinements.length !== 0) {
      uri.query[this.config.params.refinements] = origRefinements
        .sort((lhs, rhs) => lhs.navigationName.localeCompare(rhs.navigationName))
        .map(QueryUrlGenerator.stringifyRefinement)
        .join('~');
    }

    // add page size
    if (query.raw.pageSize) {
       uri.query[this.config.params.pageSize] = query.raw.pageSize;
    }

    // add page
    if (query.raw.skip) {
      uri.query[this.config.params.page] = Math.floor(query.raw.skip / query.raw.pageSize) + 1;
    }

    let url = `/${uri.path.map((path) => encodeURIComponent(path)).join('/')}`;
    if (this.config.suffix) url += `/${this.config.suffix.replace(/^\/+/, '')}`;

    const queryPart = Object.keys(uri.query).sort().map((key) => {
      return `${key}=${encodeURIComponent(uri.query[key])}`;
    }).join('&');

    if (queryPart) {
      url += '?' + queryPart;
    }

    return url.replace(/\s|%20/g, '-');
  }

  private generateRefinementMap(refinements: SelectedRefinement[]): { map: any, keys: string[] } {
    const refinementMap = {};
    const refinementKeys = [];
    for (let mapping of this.config.refinementMapping) {
      const key = Object.keys(mapping)[0];
      const matchingRefinements = refinements.filter((refinement) => refinement.navigationName === mapping[key]);
      if (matchingRefinements.length !== 0) {
        refinementKeys.push(key);
        refinementMap[key] = matchingRefinements;
        matchingRefinements.forEach((ref) => refinements.splice(refinements.indexOf(ref), 1));
      }
    }
    return { map: refinementMap, keys: refinementKeys };
  }

  static convertToSelectedValueRefinement(refinement: SelectedRefinement): SelectedValueRefinement {
    if (refinement.type === 'Value') {
      return <SelectedValueRefinement>refinement;
    } else {
      throw new Error('cannot map range refinements');
    }
  }

  static stringifyRefinement(refinement: SelectedRefinement): string {
    const name = refinement.navigationName;
    if (refinement.type === 'Value') {
      return `${name}:${(<SelectedValueRefinement>refinement).value}`;
    } else {
      return `${name}:${(<SelectedRangeRefinement>refinement).low}..${(<SelectedRangeRefinement>refinement).high}`;
    }
  }

  static refinementsComparator(refinement1: SelectedValueRefinement, refinement2: SelectedValueRefinement): number {
    let comparison = refinement1.navigationName.localeCompare(refinement2.navigationName);
    if (comparison === 0) {
      comparison = refinement1.value.localeCompare(refinement2.value);
    }
    return comparison;
  }
}

export class QueryUrlParser {

  searchandiserConfig: SearchandiserConfig;
  config: BeautifierConfig;
  suffixRegex: RegExp;

  constructor({ config, searchandiserConfig }: Beautifier) {
    this.config = config;
    this.searchandiserConfig = searchandiserConfig;
    this.suffixRegex = new RegExp(`^${this.config.suffix}`);
  }

  parse(url: { path: string, query: string}): Query {
    const paths = url.path.split('/').filter((val) => val);

    if (paths[paths.length - 1] === this.config.suffix) {
      paths.pop();
    }

    const query = this.config.useReferenceKeys ?
      this.parsePathWithReferenceKeys(paths) : this.parsePathWithoutReferenceKeys(paths);

    const queryVariables = queryString.parse(url.query);
    const unmappedRefinements = <string>queryVariables[this.config.params.refinements];
    const pageSize = parseInt(<string>queryVariables[this.config.params.pageSize], 10);
    const page = parseInt(<string>queryVariables[this.config.params.page], 10);
    if (unmappedRefinements) {
      query.withSelectedRefinements(...this.extractUnmapped(unmappedRefinements));
    }
    if (pageSize) {
      query.withPageSize(pageSize);
    }
    if (page) {
      query.skip(query.raw.pageSize * (page - 1));
    }

    return query;
  }

  private parsePathWithReferenceKeys(path: string[]): Query {
    const query = new Query().withConfiguration(this.searchandiserConfig, CONFIGURATION_MASK);
    const keys = (path.pop() || '').split('');
    if (path.length < keys.length) {
      throw new Error('token reference is invalid');
    }
    const map = this.generateRefinementMapping();
    keys.forEach((key) => {
      if (!(key in map || key === this.config.queryToken)) {
        throw new Error(`unexpected token '${key}' found in reference`);
      }
    });

    // remove prefixed paths
    path.splice(0, path.length - keys.length);

    for (let i = 0; i < keys.length; i++) {
      if (keys[i] === this.config.queryToken) {
        query.withQuery(this.decode(path[i]));
      } else {
        query.withSelectedRefinements(...this.extractRefinements(path[i], map[keys[i]]));
      }
    }
    return query;
  }

  private parsePathWithoutReferenceKeys(path: string[]): Query {
    const query = new Query().withConfiguration(this.searchandiserConfig, CONFIGURATION_MASK);
    if (path.length % 2 === 1) {
      query.withQuery(this.decode(path.shift()));
    }

    while (path.length > 0) {
      const value = this.decode(path.shift());
      const navigationName = path.shift();
      query.withSelectedRefinements({ navigationName, type: 'Value', value });
    }

    return query;
  }

  private generateRefinementMapping() {
    return this.config.refinementMapping.reduce((map, mapping) => Object.assign(map, mapping), {});
  }

  private extractRefinements(refinementString: string, navigationName: string): SelectedValueRefinement[] {
    const refinementStrings = refinementString.split('~');

    return <any[]>refinementStrings.map((value) => ({ navigationName, type: 'Value', value: this.decode(value) }));
  }

  private extractUnmapped(refinementString: string): Array<SelectedValueRefinement | SelectedRangeRefinement> {
    const refinementStrings = refinementString.split('~');
    return refinementStrings
      .map(this.decode)
      .map((refinement) => {
        const [navigationName, value] = refinement.split(':');
        if (value.indexOf('..') >= 0) {
          const [low, high] = value.split('..');
          return <any>{ navigationName, low: Number(low), high: Number(high), type: 'Range' };
        } else {
          return <any>{ navigationName, value, type: 'Value' };
        }
      });
  }

  private decode(value: string): string {
    return decodeURIComponent(value.replace(/-/g, ' '));
  }
}