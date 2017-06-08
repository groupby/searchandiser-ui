import { Beautifier, BeautifierConfig, Detail } from './interfaces';
import { SelectedValueRefinement } from 'groupby-api';

export class DetailUrlGenerator {
  config: BeautifierConfig;

  constructor({ config }: Beautifier) {
    this.config = config;
  }

  build(detail: Detail): string {
    let paths = [detail.productTitle];

    if (detail.refinements.length !== 0) {
      if (this.config.useReferenceKeys) {
        let referenceKeys = '';
        const refinementsToKeys = this.config.refinementMapping.reduce((map, mapping) => {
          const key = Object.keys(mapping)[0];
          map[mapping[key]] = key;
          return map;
        }, {});

        detail.refinements.sort(DetailUrlGenerator.refinementsComparator)
          .forEach((refinement) => {
            if (!(refinement.navigationName in refinementsToKeys)) {
              throw new Error(`no mapping found for navigation '${refinement.navigationName}'`);
            }

            paths.push(refinement.value);
            referenceKeys += refinementsToKeys[refinement.navigationName];
          });

        paths.push(referenceKeys);
      } else {
        detail.refinements.forEach(({ value, navigationName }) => paths.push(value, navigationName));
      }
    }

    paths.push(detail.productId);
    return `/${paths.map((path) => encodeURIComponent(path.replace(/\s/g, '-'))).join('/')}`;
  }

  static refinementsComparator(refinement1: SelectedValueRefinement, refinement2: SelectedValueRefinement): number {
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

  parse(url: { path: string, query: string}): Detail {
    const paths = url.path.split('/').filter((val) => val).map((val) => decodeURIComponent(val).replace(/-/g, ' '));

    if (paths.length < 2) {
      throw new Error('path has less than two parts');
    }

    const name = paths.shift();
    const id = paths.pop();

    const refinements = [];

    if (paths.length !== 0) {
      if (!this.config.useReferenceKeys) {
        if (paths.length % 2 !== 0) {
          throw new Error('path has an odd number of parts');
        }

        while (paths.length !== 0) {
          const value = paths.shift();
          const navigationName = paths.shift();
          refinements.push({ navigationName, value, type: 'Value' });
        }
      } else {
        if (paths.length < 2) {
          throw new Error('path has wrong number of parts');
        }

        const referenceKeys = paths.pop().split('');
        const keysToRefinements = this.config.refinementMapping.reduce((map, mapping) => {
          const key = Object.keys(mapping)[0];
          map[key] = mapping[key];
          return map;
        }, {});

        if (paths.length !== referenceKeys.length) {
          throw new Error('token reference is invalid');
        }

        paths.forEach((value) => refinements.push({
          value,
          navigationName: keysToRefinements[referenceKeys.shift()],
          type: 'Value'
        }));
      }
    }

    return {
      productTitle: name,
      productId: id,
      refinements
    };
  }
}