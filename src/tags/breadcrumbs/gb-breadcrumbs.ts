import { FluxTag } from '../tag';
import { Events } from 'groupby-api';
import { unless } from '../../utils';

export interface Breadcrumbs extends FluxTag { }

export class Breadcrumbs {

  hideQuery: boolean;
  hideRefinements: boolean;

  init() {
    this.hideQuery = unless(this.opts.hideQuery, false);
    this.hideRefinements = unless(this.opts.hideRefinements, false);

    this.opts.flux.on(Events.REFINEMENTS_CHANGED, ({ selected }) => this.update({ selected }));
    this.opts.flux.on(Events.RESULTS, ({ originalQuery }) => this.update({ originalQuery }));
    this.opts.flux.on(Events.RESET, () => this.update({ selected: [] }));
  }
}
