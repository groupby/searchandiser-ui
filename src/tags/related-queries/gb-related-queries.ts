import { FluxTag } from '../tag';
import { Events, Results } from 'groupby-api';

export class RelatedQueries extends FluxTag<any> {

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
