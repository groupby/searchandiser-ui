import { LinkTag } from '../link-list/gb-link-list';
import { Events, Results } from 'groupby-api';

export class DidYouMean extends LinkTag<any> {

  init() {
    this.expose('linkable');

    this.flux.on(Events.RESULTS, this.updateDidYouMean);
  }

  onSelect(event: Event) {
    return this.flux.rewrite((<HTMLAnchorElement>event.target).text)
      .then(() => this.services.tracker && this.services.tracker.didYouMean());
  }

  updateDidYouMean({ didYouMean: items }: Results) {
    this.update({ items });
  }
}
