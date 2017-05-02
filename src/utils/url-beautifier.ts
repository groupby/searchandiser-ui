import { Query, Request, SelectedRangeRefinement, SelectedRefinement, SelectedValueRefinement } from 'groupby-api';
import { StoreFrontConfig } from '../searchandiser';
import { URL } from './common';

export class UrlBeautifier {

  config: BeautifierConfig = {
    refinementMapping: [],
    extraRefinementsParam: 'refinements',
    queryToken: 'q',
    suffix: ''
  };
  private generator: UrlGenerator = new UrlGenerator(this);
  private parser: UrlParser = new UrlParser(this);

  constructor(public searchandiserConfig: StoreFrontConfig = <any>{}, public request: Request) {
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
      query: ''
    };
    // let url = '';
    const origRefinements = Array.of(...request.refinements);
    const countMap = {};
    const { map, keys } = this.generateRefinementMap(origRefinements);

    // add query
    if (request.query) {
      uri.path.push(request.query);
    }

    // add refinements
    for (let key of keys) {
      const refinements = <SelectedRefinement[]>map[key];
      countMap[key] = refinements.length;
      uri.path.push(...refinements.map(this.convertRefinement).sort());
    }

    // add reference key
    if (keys.length || request.query) {
      let referenceKey = '';
      if (request.query) referenceKey += this.config.queryToken;
      keys.forEach((key) => referenceKey += key.repeat(countMap[key]));
      uri.path.push(referenceKey);
    }

    // add remaining refinements
    if (origRefinements.length) {
      uri.query = origRefinements
        .sort((lhs, rhs) => lhs.navigationName.localeCompare(rhs.navigationName))
        .map(this.stringifyRefinement)
        .join('~');
    }

    let url = `/${uri.path.map((path) => encodeURIComponent(path)).join('/')}`;
    if (this.config.suffix) url += `/${this.config.suffix.replace(/^\/+/, '')}`;
    if (uri.query) url += `?${this.config.extraRefinementsParam}=${encodeURIComponent(uri.query)}`;

    return url.replace(/\s|%20/g, '+');
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

  private convertRefinement(refinement: SelectedRefinement): string {
    if (refinement.type === 'Value') {
      return (<SelectedValueRefinement>refinement).value;
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
}

export class UrlParser {

  searchandiserConfig: StoreFrontConfig;
  config: BeautifierConfig;
  request: Request;
  suffixRegex: RegExp;

  constructor({ config, searchandiserConfig, request }: UrlBeautifier) {
    this.config = config;
    this.request = request;
    this.searchandiserConfig = searchandiserConfig;
    this.suffixRegex = new RegExp(`^${this.config.suffix}`);
  }

  parse(rawUrl: string): Query {
    const url = new URL(rawUrl, true);
    const paths = url.pathname.split('/').filter((val) => val);

    if (paths[paths.length - 1] === this.config.suffix) paths.pop();

    const keys = (paths.pop() || '').split('');
    const map = this.generateRefinementMapping();
    const query = new Query().withConfiguration(this.request);

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

    const unmappedRefinements = url.query[this.config.extraRefinementsParam];
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
    return decodeURIComponent(value.replace('+', ' '));
  }
}

export interface BeautifierConfig {
  refinementMapping?: any[];
  extraRefinementsParam?: string;
  queryToken?: string;
  suffix?: string;
}
