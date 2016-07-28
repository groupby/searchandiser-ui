import { FluxTag } from '../tag';
import { Events } from 'groupby-api';
import { toRefinement } from '../../utils';

export interface Filter extends FluxTag { }

export class Filter {

  selectElement: { _tag: Filter };
  parentOpts: any;
  navField: string;
  selected: any;
  passthrough: any;

  init() {
    this.parentOpts = this.opts.passthrough || this.opts;
    this.navField = this.parentOpts.field;

    const flux = this.parentOpts.clone();
    const isTargetNav = (nav) => nav.name === this.navField;
    const convertRefinements = (navigations) => {
      const found = navigations.find(isTargetNav)
      return found ? found.refinements.map((ref) => ({ label: ref.value, value: ref })) : [];
    };
    const updateValues = (res) => this.selectElement._tag.update({ options: convertRefinements(res.availableNavigation) });

    this.passthrough = Object.assign({}, this.parentOpts.__proto__, {
      hover: this.parentOpts.onHover,
      update: this.navigate,
      label: this.parentOpts.label || 'Filter',
      clear: this.parentOpts.clear || 'Unfiltered'
    });

    this.parentOpts.flux.on(Events.RESULTS, () => {
      const searchRequest = this.parentOpts.flux.query.raw;
      // TODO this is probably broken in terms of state propagation
      flux.query.withConfiguration({ refinements: [] });
      if (searchRequest.refinements) flux.query.withSelectedRefinements(...searchRequest.refinements.filter((ref) => ref.navigationName !== this.navField));

      flux.search(searchRequest.query).then(updateValues);
    });
  }

  navigate(value) {
    if (this.selected) this.parentOpts.flux.unrefine(this.selected, { skipSearch: true });
    if (value === '*') {
      this.parentOpts.flux.reset();
    } else {
      this.parentOpts.flux.refine(this.selected = toRefinement(value, { name: this.navField }));
    }
  }
}
