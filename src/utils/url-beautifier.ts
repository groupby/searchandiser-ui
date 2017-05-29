import { CONFIGURATION_MASK, SearchandiserConfig } from '../searchandiser';
import { Query, SelectedRangeRefinement, SelectedRefinement, SelectedValueRefinement } from 'groupby-api';
import * as parseUri from 'parseUri';
import * as queryString from 'query-string';

export class UrlBeautifier {

  config: BeautifierConfig = {
    refinementMapping: [],
    extraRefinementsParam: 'refinements',
    pageSizeParam: 'page_size',
    pageParam: 'page',
    defaultPageSize: 10,
    queryToken: 'q',
    suffix: '',
    useReferenceKeys: true
  };
  private generator: UrlGenerator = new UrlGenerator(this);
  private parser: UrlParser = new UrlParser(this);

  constructor(public searchandiserConfig: SearchandiserConfig = <any>{}) {
    const urlConfig = searchandiserConfig.url || {};
    const config = typeof urlConfig.beautifier === 'object' ? urlConfig.beautifier : {};
    Object.assign(this.config, config);

    const keys = [];
    for (let mapping of this.config.refinementMapping) {
      const key = Object.keys(mapping)[0];
      if (key.length !== 1) {
        throw new Error('refinement mapping token must be a single character');
      }
      if (key.match(/[aeiouy]/)) {
        throw new Error('refinement mapping token must not be a vowel');
      }
      if (keys.indexOf(key) > -1) {
        throw new Error('refinement mapping tokens must be unique');
      }
      keys.push(key);
    }
    if (this.config.queryToken.length !== 1) {
      throw new Error('query token must be a single character');
    }
    if (this.config.queryToken.match(/[aeiouy]/)) {
      throw new Error('query token must not be a vowel');
    }
    if (keys.indexOf(this.config.queryToken) > -1) {
      throw new Error('query token must be unique from refinement tokens');
    }
  }

  parse(url: string) {
    return this.parser.parse(url);
  }

  build(query: Query) {
    return this.generator.build(query);
  }
}

export class UrlGenerator {

  config: BeautifierConfig;

  constructor({ config }: UrlBeautifier) {
    this.config = config;
  }

  build(query: Query): string {
    const request = query.build();
    const uri = {
      path: [],
      query: {}
    };
    // let url = '';
    const origRefinements = Array.of(...request.refinements);

    // add query
    if (request.query) {
      uri.path.push(request.query);
    }

    if (this.config.useReferenceKeys) {
      const countMap = {};
      const { map, keys } = this.generateRefinementMap(origRefinements);

      // add refinements
      for (let key of keys) {
        const refinements = <SelectedRefinement[]>map[key];
        countMap[key] = refinements.length;
        refinements.map(this.convertToSelectedValueRefinement)
          .sort(this.refinementsComparator)
          .forEach((selectedValueRefinement) => {
            uri.path.push(selectedValueRefinement.value);
          });
      }

      // add reference key
      if (keys.length || request.query) {
        let referenceKey = '';
        if (request.query) referenceKey += this.config.queryToken;
        keys.forEach((key) => referenceKey += key.repeat(countMap[key]));
        uri.path.push(referenceKey);
      }
    } else {
      // add refinements
      let valueRefinements = [], rangeRefinement = [];
      for (let i = origRefinements.length - 1; i >= 0; --i) {
        if (origRefinements[i].type === 'Value') {
          valueRefinements.push(...origRefinements.splice(i, 1));
        }
      }

      valueRefinements.map(this.convertToSelectedValueRefinement)
        .sort(this.refinementsComparator)
        .forEach((selectedValueRefinement) => {
          uri.path.push(selectedValueRefinement.value, selectedValueRefinement.navigationName);
        });
    }

    // add remaining refinements
    if (origRefinements.length) {
      uri.query[this.config.extraRefinementsParam] = origRefinements
        .sort((lhs, rhs) => lhs.navigationName.localeCompare(rhs.navigationName))
        .map(this.stringifyRefinement)
        .join('~');
    }

    // add page size
    if (query.raw.pageSize) {
       uri.query[this.config.pageSizeParam] = query.raw.pageSize;
    }

    // add page
    if (query.raw.skip) {
      uri.query[this.config.pageParam] = Math.floor(query.raw.skip/(query.raw.pageSize || this.config.defaultPageSize))+1;
    }

    let url = `/${uri.path.map((path) => encodeURIComponent(path)).join('/')}`;
    if (this.config.suffix) url += `/${this.config.suffix.replace(/^\/+/, '')}`;

    const queryString = Object.keys(uri.query).sort().map((key) => {
      return `${key}=${encodeURIComponent(uri.query[key])}`;
    }).join('&');

    if (queryString) url += '?' + queryString;

    return url.replace(/\s|%20/g, '-');
  }

  private generateRefinementMap(refinements: SelectedRefinement[]): { map: any, keys: string[] } {
    const refinementMap = {};
    const refinementKeys = [];
    for (let mapping of this.config.refinementMapping) {
      const key = Object.keys(mapping)[0];
      const matchingRefinements = refinements.filter((refinement) => refinement.navigationName === mapping[key]);
      if (matchingRefinements.length) {
        refinementKeys.push(key);
        refinementMap[key] = matchingRefinements;
        matchingRefinements.forEach((ref) => refinements.splice(refinements.indexOf(ref), 1));
      }
    }
    return { map: refinementMap, keys: refinementKeys };
  }

  private convertToSelectedValueRefinement(refinement: SelectedRefinement): SelectedValueRefinement {
    if (refinement.type === 'Value') {
      return <SelectedValueRefinement>refinement;
    } else {
      throw new Error('cannot map range refinements');
    }
  }

  private stringifyRefinement(refinement: SelectedRefinement): string {
    const name = refinement.navigationName;
    if (refinement.type === 'Value') {
      return `${name}=${(<SelectedValueRefinement>refinement).value}`;
    } else {
      return `${name}:${(<SelectedRangeRefinement>refinement).low}..${(<SelectedRangeRefinement>refinement).high}`;
    }
  }

  private refinementsComparator(refinement1: SelectedValueRefinement, refinement2: SelectedValueRefinement): number {
    let comparison = refinement1.navigationName.localeCompare(refinement2.navigationName);
    if (comparison === 0) {
      comparison = refinement1.value.localeCompare(refinement2.value);
    }
    return comparison;
  }
}

export class UrlParser {

  searchandiserConfig: SearchandiserConfig;
  config: BeautifierConfig;
  suffixRegex: RegExp;

  constructor({ config, searchandiserConfig }: UrlBeautifier) {
    this.config = config;
    this.searchandiserConfig = searchandiserConfig;
    this.suffixRegex = new RegExp(`^${this.config.suffix}`);
  }

  parse(rawUrl: string): Query {
    const url = parseUri(rawUrl);
    const paths = url.path.split('/').filter((val) => val);

    if (paths[paths.length - 1] === this.config.suffix) paths.pop();

    const keys = (paths.pop() || '').split('');
    const map = this.generateRefinementMapping();
    const query = new Query().withConfiguration(this.searchandiserConfig, CONFIGURATION_MASK);

    for (let key of keys) {
      if (!(key in map || key === this.config.queryToken)) {
        throw new Error(`unexpected token '${key}' found in reference`);
      }
    }

    if (paths.length < keys.length) throw new Error('token reference is invalid');

    // remove prefixed paths
    paths.splice(0, paths.length - keys.length);

    for (let i = 0; i < keys.length; i++) {
      if (keys[i] === this.config.queryToken) {
        query.withQuery(this.decode(paths[i]));
      } else {
        query.withSelectedRefinements(...this.extractRefinements(paths[i], map[keys[i]]));
      }
    }

    const unmappedRefinements = <string>queryString.parse(url.query)[this.config.extraRefinementsParam];
    if (unmappedRefinements) {
      query.withSelectedRefinements(...this.extractUnmapped(unmappedRefinements));
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
        const [navigationName, value] = refinement.split(/=|:/);
        if (value.indexOf('..') >= 0) {
          const [low, high] = value.split('..');
          return <any>{ navigationName, low: Number(low), high: Number(high), type: 'Range' };
        } else {
          return <any>{ navigationName, value, type: 'Value' };
        }
      });
  }

  private decode(value: string): string {
    return decodeURIComponent(value.replace('-', ' '));
  }
}

export interface BeautifierConfig {
  refinementMapping?: any[];
  extraRefinementsParam?: string;
  pageSizeParam?: string;
  pageParam?: string;
  defaultPageSize?: number;
  queryToken?: string;
  suffix?: string;
  useReferenceKeys?: boolean;
}
