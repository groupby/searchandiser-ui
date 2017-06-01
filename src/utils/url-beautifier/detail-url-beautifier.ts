import { Query, SelectedRangeRefinement, SelectedRefinement, SelectedValueRefinement, Navigation } from 'groupby-api';
import { Beautifier, BeautifierConfig, Detail } from './interfaces';
import { CONFIGURATION_MASK, SearchandiserConfig } from '../../searchandiser';
import * as parseUri from 'parseUri';
import * as queryString from 'query-string';

export class DetailUrlGenerator {
  config: BeautifierConfig;

  constructor({ config }: Beautifier) {
    this.config = config;
  }

  build(detail: Detail): string {
    let paths = [detail.productTitle];

    if (detail.refinements) {
      detail.refinements.forEach((ref) => {
        paths.push(ref.value);
        paths.push(ref.navigationName);
      });
    }

    paths.push(detail.productID);
    return `/${paths.map((path) => encodeURIComponent(path.replace(/\s/g, '-'))).join('/')}`;
  }
}

export class DetailUrlParser {
  config: BeautifierConfig;

  constructor({ config }: Beautifier) {
    this.config = config;
  }
}
