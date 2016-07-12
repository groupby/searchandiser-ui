<gb-filter>
  <gb-select name="selectElement" update={ navigate } native={ opts.native } label={ label } clear={ clear } hover={ opts.onHover }></gb-select>

  <script>
    require('./gb-select.tag');
    const utils = require('../utils');
    const navField = opts.field;
    const flux = opts.clone();
    const isTargetNav = (nav) => nav.name === navField;
    const convertRefinements = (navigations) => navigations.find(isTargetNav).refinements.map(ref => ({ label: ref.value, value: ref }));
    const updateValues = (res) => this.selectElement._tag.update({ options: convertRefinements(res.availableNavigation) });

    this.label = opts.label || 'Filter';
    this.clear = opts.clear || 'Unfiltered';
    this.navigate = (value) => {
      if (this.selected) opts.flux.unrefine(this.selected, { skipSearch: true });
      if (value === '*') {
        opts.flux.reset();
      } else {
        opts.flux.refine(this.selected = utils.toRefinement(value, { name: navField }));
      }
    };

    opts.flux.on(opts.flux.RESULTS, res => {
      const searchRequest = opts.flux.query.raw;
      // TODO this is probably broken in terms of state propagation
      flux.query.withConfiguration({ refinements: [] });
      if (searchRequest.refinements) flux.query.withSelectedRefinements(...searchRequest.refinements.filter(ref => ref.navigationName !== navField));

      flux.search(searchRequest.query).then(updateValues);
    });
  </script>
</gb-filter>
