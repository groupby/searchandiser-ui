import { FluxTag } from '../tag';
import { Events, Results } from 'groupby-api';

export interface RelatedQueries extends FluxTag<any> { }

export class RelatedQueries {

  relatedQueries: string[];

  init() {
    this.flux.on(Events.RESULTS, this.updatedRelatedQueries);
  }

  updatedRelatedQueries({ relatedQueries }: Results) {
    this.update({ relatedQueries });
  }

  send(event: Event) {
    return this.flux.rewrite((<HTMLAnchorElement>event.target).text);
  }
}
