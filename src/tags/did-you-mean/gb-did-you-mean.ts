import { Events } from 'groupby-api';

export class DidYouMean {

  opts: any;
  update: (any) => void;

  init() {
    this.opts.flux.on(Events.RESULTS, ({ didYouMean }) => this.update({ didYouMean }));
  }

  send(event: Event) {
    this.opts.flux.rewrite((<HTMLAnchorElement>event.target).text);
  }
}
