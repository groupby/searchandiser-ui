import { Query } from 'groupby-api';
import { Beautifier, BeautifierConfig, Generator, Parser } from './interfaces';
import { QueryUrlGenerator, QueryUrlParser } from './queries-url-beautifier';
import { SearchandiserConfig } from '../../searchandiser';

export class UrlBeautifier implements Beautifier {

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
  private generator: QueryUrlGenerator = new QueryUrlGenerator(this);
  private parser: QueryUrlParser = new QueryUrlParser(this);

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
