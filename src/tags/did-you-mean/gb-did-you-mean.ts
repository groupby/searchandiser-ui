import { FluxTag } from '../tag';
import { Events } from 'groupby-api';

export interface DidYouMean extends FluxTag { }

export class DidYouMean {

  init() {
    this.flux.on(Events.RESULTS, ({ didYouMean }) => this.updateDidYouMean(didYouMean));
  }

  send(event: Event) {
    this.flux.rewrite((<HTMLAnchorElement>event.target).text);
  }

  updateDidYouMean(didYouMean: string[]) {
    this.update({ didYouMean });
  }
}
