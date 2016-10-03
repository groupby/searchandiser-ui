import { CONFIGURATION_MASK, SearchandiserConfig, UrlConfig } from '../searchandiser';
import { Query } from 'groupby-api';
import * as parseUri from 'parseuri';
import * as queryString from 'query-string';

export class SimpleBeautifier {

  urlConfig: UrlConfig;

  constructor(private config: SearchandiserConfig) {
    this.urlConfig = config.url || {};
  }

  parse(url: string) {
    const queryParams: any = queryString.parse(parseUri(url).query);
    const queryFromUrl = new Query(queryParams[this.urlConfig.queryParam] || '')
      .withConfiguration(this.config, CONFIGURATION_MASK);

    if (queryParams.refinements) {
      const refinements = JSON.parse(queryParams.refinements);
      if (refinements.length > 0) {
        queryFromUrl.withSelectedRefinements(...refinements);
      }
    }

    return queryFromUrl;
  }

  build(query: Query) {
    const request = query.build();
    const queryObj = {};

    if ('refinements' in request && request.refinements.length > 0) {
      queryObj['refinements'] = JSON.stringify(request.refinements);
    }

    queryObj[this.urlConfig.queryParam] = request.query;

    return `${this.urlConfig.searchUrl}?${queryString.stringify(queryObj)}`;
  }
}
