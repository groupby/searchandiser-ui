import { Events } from 'groupby-api';

export class Results {

  parent: any;
  opts: any;
  update: (any) => void;

  struct: any;

  init() {
    this.struct = this.parent ? this.parent.struct : this.opts.config.structure;

    this.opts.flux.on(Events.RESULTS, ({ records }) => this.update({ records }));
  }

  userStyle(key: string) {
    return this.opts.css ? this.opts.css[key] : '';
  }

}
