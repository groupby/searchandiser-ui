import { FluxTag } from '../tag';
import { Events, Results } from 'groupby-api';

export interface DidYouMean extends FluxTag<any> { }

export class DidYouMean {

  init() {
    this.flux.on(Events.RESULTS, this.updateDidYouMean);
  }

  send(event: Event) {
    this.flux.rewrite((<HTMLAnchorElement>event.target).text)
      .then(() => this.services.tracker.didYouMean());
  }

  updateDidYouMean({ didYouMean }: Results) {
    this.update({ didYouMean });
  }
}
