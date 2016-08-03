import { FluxTag } from '../tag';
import { Events } from 'groupby-api';

export interface RelatedSearches extends FluxTag { }

export class RelatedSearches {

  relatedQueries: string[];

  init() {
    this.opts.flux.on(Events.RESULTS, ({ relatedQueries }) => this.updatedRelatedQueries(relatedQueries));
  }

  updatedRelatedQueries(relatedQueries: string[]) {
    this.update({ relatedQueries });
  }

  send(event: Event) {
    return this.opts.flux.rewrite((<HTMLAnchorElement>event.target).text);
  }
}
