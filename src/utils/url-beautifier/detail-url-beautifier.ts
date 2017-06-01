import { SelectedValueRefinement } from 'groupby-api';
import { Beautifier, BeautifierConfig, Detail } from './interfaces';
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
      if (this.config.useReferenceKeys) {
        let referenceKeys = '';
        let refinementsToKeys = this.config.refinementMapping.reduce((map, mapping) => {
          const key = Object.keys(mapping)[0];
          map[mapping[key]] = key;
          return map;
        }, {});

        detail.refinements.sort(this.refinementsComparator).forEach((refinement) => {
          if (!(refinement.navigationName in refinementsToKeys))
            throw new Error(`no mapping found for navigation "${refinement.navigationName}"`);
          paths.push(refinement.value);
          referenceKeys += (refinementsToKeys[refinement.navigationName]);
        });

        paths.push(referenceKeys);
      } else {
        detail.refinements.forEach((ref) => {
          paths.push(ref.value);
          paths.push(ref.navigationName);
        });
      }
    }

    paths.push(detail.productID);
    return `/${paths.map((path) => encodeURIComponent(path.replace(/\s/g, '-'))).join('/')}`;
  }

  private refinementsComparator(refinement1: SelectedValueRefinement, refinement2: SelectedValueRefinement): number {
    let comparison = refinement1.navigationName.localeCompare(refinement2.navigationName);
    if (comparison === 0) {
      comparison = refinement1.value.localeCompare(refinement2.value);
    }
    return comparison;
  }
}

export class DetailUrlParser {
  config: BeautifierConfig;

  constructor({ config }: Beautifier) {
    this.config = config;
  }
}
