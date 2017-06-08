import { SearchandiserConfig } from '../../searchandiser';
import { DetailUrlGenerator, DetailUrlParser } from './detail-url-beautifier';
import { Beautifier, BeautifierConfig, Detail } from './interfaces';
import { NavigationUrlGenerator, NavigationUrlParser } from './navigation-url-beautifier';
import { QueryUrlGenerator, QueryUrlParser } from './query-url-beautifier';
import { Query } from 'groupby-api';
import * as parseUri from 'parseUri';

export class UrlBeautifier implements Beautifier {

  config: BeautifierConfig = {
    refinementMapping: [],
    params: {
      refinements: 'refinements',
      page: 'page',
      pageSize: 'page_size'
    },
    queryToken: 'q',
    suffix: '',
    useReferenceKeys: true,
    navigations: {},
    routes: {
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
      this.validateToken(key, keys);
      keys.push(key);
    }
    this.validateToken(this.config.queryToken, keys);
  }

  parse(rawUrl: string): any {
    const uri = parseUri(rawUrl);
    const path = uri.path;
    if (path.indexOf(this.config.routes.query) === 0) {
      return this.queryParser.parse(this.extractUnprefixedPathAndQuery(uri, this.config.routes.query));
    } else if (path.indexOf(this.config.routes.detail) === 0) {
      return this.detailParser.parse(this.extractUnprefixedPathAndQuery(uri, this.config.routes.detail));
    } else if (path.indexOf(this.config.routes.navigation) === 0) {
      return this.navigationParser.parse(this.extractUnprefixedPathAndQuery(uri, this.config.routes.navigation));
    } else {
      throw new Error('invalid prefix');
    }
  }

  validateToken(token: string, keys: string[]) {
    if (token.length !== 1) {
      throw new Error('token must be a single character');
    }
    if (token.match(/[aeiouy]/)) {
      throw new Error('token must not be a vowel');
    }
    if (keys.indexOf(token) > -1) {
      throw new Error('tokens must be unique');
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

  private extractUnprefixedPathAndQuery(uri: parseUri.UriStructure, prefix: string): { path: string, query: string } {
    return { path: uri.path.substr(prefix.length), query: uri.query };
  }
}