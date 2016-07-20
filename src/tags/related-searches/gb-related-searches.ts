import { Events } from 'groupby-api';

export class RelatedSearches {

  opts: any;
  update: (any) => void;

  init() {
    this.opts.flux.on(Events.RESULTS, ({ relatedQueries }) => this.update({ relatedQueries }));
  }

  send(event: Event) {
    return this.opts.flux.rewrite((<HTMLAnchorElement>event.target).text);
  }
}
