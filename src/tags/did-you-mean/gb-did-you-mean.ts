import { FluxTag } from '../tag';
import { Events } from 'groupby-api';

export interface DidYouMean extends FluxTag { }

export class DidYouMean {

  init() {
    this.opts.flux.on(Events.RESULTS, ({ didYouMean }) => this.updateDidYouMean(didYouMean));
  }

  send(event: Event) {
    this.opts.flux.rewrite((<HTMLAnchorElement>event.target).text);
  }

  updateDidYouMean(didYouMean: string[]) {
    this.update({ didYouMean });
  }
}
