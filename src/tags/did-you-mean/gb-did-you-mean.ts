import { FluxTag } from '../tag';
import { Events, Results } from 'groupby-api';

export interface DidYouMean extends FluxTag<any> { }

export const SCHEMA = {
  send: { value: send, for: 'gb-list' }
};

export class DidYouMean {

  didYouMean: string[];

  init() {
    this.$schema(SCHEMA);

    this.flux.on(Events.RESULTS, this.updateDidYouMean);
  }

  updateDidYouMean({ didYouMean }: Results) {
    this.update({ didYouMean });
  }
}

export function send({ target }: any) {
  return this.flux.rewrite(target.text)
    .then(() => this.services.tracker && this.services.tracker.didYouMean());
}
