import { FluxTag } from '../tag';
import { Events, Results } from 'groupby-api';

export interface RelatedQueries extends FluxTag<any> { }

export class RelatedQueries {

  items: string[];

  init() {
    this.alias('linkable');

    this.flux.on(Events.RESULTS, this.updatedRelatedQueries);
  }

  updatedRelatedQueries({ relatedQueries: items }: Results) {
    this.update({ items });
  }

  onSelect({ target }: Event & { target: HTMLAnchorElement }) {
    return this.flux.rewrite(target.text);
  }
}
