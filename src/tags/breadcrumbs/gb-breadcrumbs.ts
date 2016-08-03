import { FluxTag } from '../tag';
import { Events } from 'groupby-api';
import { unless } from '../../utils';

export interface Breadcrumbs extends FluxTag { }

export class Breadcrumbs {

  selected: any[];
  originalQuery: string;
  hideQuery: boolean;
  hideRefinements: boolean;

  init() {
    this.hideQuery = unless(this.opts.hideQuery, false);
    this.hideRefinements = unless(this.opts.hideRefinements, false);

    this.opts.flux.on(Events.REFINEMENTS_CHANGED, ({ selected }) => this.updateRefinements(selected));
    this.opts.flux.on(Events.RESULTS, ({ originalQuery }) => this.updateQuery(originalQuery));
    this.opts.flux.on(Events.RESET, () => this.clearRefinements());
  }

  clearRefinements() {
    this.updateRefinements([]);
  }

  updateRefinements(selected) {
    this.update({ selected });
  }

  updateQuery(originalQuery: string) {
    this.update({ originalQuery });
  }
}
