import { CONFIGURATION_MASK, SearchandiserConfig, UrlConfig } from '../searchandiser';
import { LOCATION } from '../utils';
import { FluxCapacitor, Query } from 'groupby-api';
import queryString = require('query-string');

const DEFAULT_CONFIG: UrlConfig = { queryParam: 'q' };

export class UrlParser {

  constructor(private flux: FluxCapacitor, private config: SearchandiserConfig) { }

  init() {
    if (!this.config.initialSearch) {
      const config: UrlConfig = Object.assign({}, DEFAULT_CONFIG, this.config.url);

      const query = UrlParser.parseQueryFromLocation(config.queryParam, this.config);

      if (query) {
        this.flux.query = query;
        this.flux.search(query.raw.query);
      }
    }
  }
  static parseQueryFromLocation(queryParamName: string, queryConfig: any) {
    const queryParams = queryString.parse(LOCATION.getSearch());
    const queryFromUrl = new Query(queryParams[queryParamName] || '')
      .withConfiguration(queryConfig, CONFIGURATION_MASK);

    if (queryParams.refinements) {
      const refinements = JSON.parse(queryParams.refinements);
      if (refinements.length > 0) {
        refinements.forEach((refinement) => queryFromUrl.withSelectedRefinements(refinement));
      }
    }
    return queryFromUrl;
  }
}
