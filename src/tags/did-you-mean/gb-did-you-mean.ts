import { FluxTag } from '../tag';
import { Events, Results } from 'groupby-api';

export class DidYouMean extends FluxTag<any> {

  items: string[];

  init() {
    this.alias('linkable');

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
