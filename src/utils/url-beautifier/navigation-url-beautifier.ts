import { Beautifier, BeautifierConfig } from './interfaces';
import { Query } from 'groupby-api';

export class NavigationUrlGenerator {
  config: BeautifierConfig;

  constructor({ config }: Beautifier) {
    this.config = config;
  }

  build(name: string): string {
    if (!(name in this.config.navigations)) {
      throw new Error(`no navigation mapping found for ${name}`);
    }

    return '/' + encodeURIComponent(name.replace(/\s/g, '-'));
  }
}

export class NavigationUrlParser {
  config: BeautifierConfig;

  constructor({ config }: Beautifier) {
    this.config = config;
  }

  parse(url: { path: string, query: string} ): Query {
    const paths = url.path.split('/').filter((val) => val);
    if (paths.length > 1) {
      throw new Error('path contains more than one part');
    }

    const name = decodeURIComponent(paths[0]).replace(/-/g, ' ');
    if (!(name in this.config.navigations)) {
      throw new Error(`no navigation mapping found for ${name}`);
    }

    return this.config.navigations[name];
  }
}
