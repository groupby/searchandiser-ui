import { FluxTag } from '../tag';
import { Events, Results } from 'groupby-api';

export interface RelatedQueries extends FluxTag<any> { }

export const SCHEMA = {
  send: { value: send, for: 'gb-list' }
};

export class RelatedQueries {

  relatedQueries: string[];

  init() {
    this.$schema(SCHEMA);

    this.flux.on(Events.RESULTS, this.updatedRelatedQueries);
  }

  updatedRelatedQueries({ relatedQueries }: Results) {
    this.update({ relatedQueries });
  }
}

export function send({ target }: any) {
  return this.flux.rewrite(target.text);
}
