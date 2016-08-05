import { FluxTag } from '../tag';
import { Events } from 'groupby-api';

export interface RelatedSearches extends FluxTag { }

export class RelatedSearches {

  relatedQueries: string[];

  init() {
    this.flux.on(Events.RESULTS, ({ relatedQueries }) => this.updatedRelatedQueries(relatedQueries));
  }

  updatedRelatedQueries(relatedQueries: string[]) {
    this.update({ relatedQueries });
  }

  send(event: Event) {
    return this.flux.rewrite((<HTMLAnchorElement>event.target).text);
  }
}
