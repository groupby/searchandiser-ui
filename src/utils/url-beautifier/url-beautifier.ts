import { Query } from 'groupby-api';
import { Beautifier, BeautifierConfig, Detail } from './interfaces';
import { QueryUrlGenerator, QueryUrlParser } from './query-url-beautifier';
import { NavigationUrlGenerator, NavigationUrlParser } from './navigation-url-beautifier';
import { DetailUrlGenerator, DetailUrlParser } from './detail-url-beautifier';
import { SearchandiserConfig } from '../../searchandiser';
import * as parseUri from 'parseUri';

export class UrlBeautifier implements Beautifier {

  config: BeautifierConfig = {
    refinementMapping: [],
    extraRefinementsParam: 'refinements',
    pageSizeParam: 'page_size',
    pageParam: 'page',
    defaultPageSize: 10,
    queryToken: 'q',
    suffix: '',
    useReferenceKeys: true,
    navigations: {},
    prefix: {
      query: '/query',
      detail: '/detail',
      navigation: '/navigation'
    }
  };
  private queryGenerator: QueryUrlGenerator = new QueryUrlGenerator(this);
  private queryParser: QueryUrlParser = new QueryUrlParser(this);

  private navigationGenerator: NavigationUrlGenerator = new NavigationUrlGenerator(this);
  private navigationParser: NavigationUrlParser = new NavigationUrlParser(this);

  private detailGenerator: DetailUrlGenerator = new DetailUrlGenerator(this);
  private detailParser: DetailUrlParser = new DetailUrlParser(this);

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

  parse(url: string): any {
    const path = parseUri(url).path;
    if (path.indexOf(this.config.prefix.query) === 0) {
      return this.queryParser.parse(path.substr(this.config.prefix.query.length));
    } else if (path.indexOf(this.config.prefix.detail) === 0) {
      return this.detailParser.parse(path.substr(this.config.prefix.detail.length));
    } else if (path.indexOf(this.config.prefix.navigation) === 0) {
      return this.navigationParser.parse(path.substr(this.config.prefix.navigation.length));
    }
  }

  buildQueryUrl(query: Query) {
    return this.queryGenerator.build(query);
  }

  buildNavigationUrl(name: string) {
    return this.navigationGenerator.build(name);
  }

  buildDetailUrl(detail: Detail) {
    return this.detailGenerator.build(detail);
  }

  build(query: Query) {
    return this.queryGenerator.build(query);
  }
}
