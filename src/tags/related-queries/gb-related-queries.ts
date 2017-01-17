import { LinkTag } from '../link-list/gb-link-list';
import { Events, Results } from 'groupby-api';

export class RelatedQueries extends LinkTag<any> {

  items: string[];

  init() {
    this.expose('linkable');

    this.flux.on(Events.RESULTS, this.updatedRelatedQueries);
  }

  updatedRelatedQueries({ relatedQueries: items }: Results) {
    this.update({ items });
  }

  onSelect({ target }: Event & { target: HTMLAnchorElement }) {
    return this.flux.rewrite(target.text);
  }
}
