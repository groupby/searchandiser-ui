import { SearchandiserConfig, } from '../searchandiser';
import { UrlConfig } from '../services/url';
import { Query, Request } from 'groupby-api';
import * as parseUri from 'parseUri';
import * as queryString from 'query-string';

export class SimpleBeautifier {

  urlConfig: UrlConfig;

  constructor(private config: SearchandiserConfig, private request: Request) {
    this.urlConfig = config.url || {};
  }

  parse(url: string) {
    const queryParams: any = queryString.parse(parseUri(url).query);
    const queryFromUrl = new Query(queryParams[this.urlConfig.queryParam] || '')
      .withConfiguration(this.request);

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
