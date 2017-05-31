import { Query, SelectedRangeRefinement, SelectedRefinement, SelectedValueRefinement, Navigation } from 'groupby-api';
import { Beautifier, BeautifierConfig } from './interfaces';
import { CONFIGURATION_MASK, SearchandiserConfig } from '../../searchandiser';
import * as parseUri from 'parseUri';
import * as queryString from 'query-string';

export class NavigationUrlGenerator {
  config: BeautifierConfig;

  constructor({ config }: Beautifier) {
    this.config = config;
  }
};

export class NavigationUrlParser {
  config: BeautifierConfig;

  constructor({ config }: Beautifier) {
    this.config = config;
  }

  parse(rawUrl: string): Query {
    const paths = parseUri(rawUrl).path.split('/').filter((val) => val);
    if (paths.length > 1) {
      throw new Error('path contains more than one part');
    }
    const name = paths[0];
    if (!(name in this.config.navigations)) {
      throw new Error(`no navigation mapping found for ${name}`);
    }
    return this.config.navigations[paths[0]];
  }

}