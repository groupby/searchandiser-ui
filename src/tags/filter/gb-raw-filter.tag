<gb-raw-filter>
  <gb-raw-select name="selectElement" passthrough={ passthrough }>
    <yield/>
  </gb-raw-select>

  <script>
    import { toRefinement } from '../../utils';
    const parentOpts = opts.passthrough || opts;

    const navField = parentOpts.field;
    const flux = parentOpts.clone();
    const isTargetNav = (nav) => nav.name === navField;
    const convertRefinements = (navigations) => {
      const found = navigations.find(isTargetNav)
      return found ? found.refinements.map((ref) => ({ label: ref.value, value: ref })) : [];
    };
    const updateValues = (res) => this.selectElement._tag.update({ options: convertRefinements(res.availableNavigation) });

    this.navigate = (value) => {
      if (this.selected) parentOpts.flux.unrefine(this.selected, { skipSearch: true });
      if (value === '*') {
        parentOpts.flux.reset();
      } else {
        parentOpts.flux.refine(this.selected = toRefinement(value, { name: navField }));
      }
    };

    this.passthrough = Object.assign({}, parentOpts.__proto__, {
      hover: parentOpts.onHover,
      update: this.navigate,
      label: parentOpts.label || 'Filter',
      clear: parentOpts.clear || 'Unfiltered'
    });

    parentOpts.flux.on(parentOpts.flux.RESULTS, () => {
      const searchRequest = parentOpts.flux.query.raw;
      // TODO this is probably broken in terms of state propagation
      flux.query.withConfiguration({ refinements: [] });
      if (searchRequest.refinements) flux.query.withSelectedRefinements(...searchRequest.refinements.filter((ref) => ref.navigationName !== navField));

      flux.search(searchRequest.query).then(updateValues);
    });
  </script>
</gb-raw-filter>
