<gb-breadcrumbs>
  <ul class="gb-breadcrumbs { opts.style() }">
    <li if={ !hideQuery && originalQuery }>{ originalQuery }</li>
    <li if={ !hideRefinements } each={ nav in selected }>
      <ul class="gb-nav-crumb">
        <gb-refinement-crumb each={ ref in nav.refinements }></gb-refinement-crumb>
      </ul>
    </li>
  </ul>

  <script>
    require('./gb-refinement-crumb.tag');
    const { unless } = require('../../utils');
    const { REFINEMENTS_CHANGED, RESULTS, RESET } = opts.flux;
    this.hideQuery = unless(opts.hideQuery, false);
    this.hideRefinements = unless(opts.hideRefinements, false);

    opts.flux.on(REFINEMENTS_CHANGED, ({ selected }) => this.update({ selected }));
    opts.flux.on(RESULTS, ({ originalQuery }) => this.update({ originalQuery }));
    opts.flux.on(RESET, () => this.update({ selected: [] }));
  </script>

  <style scoped>
    .gb-stylish.gb-breadcrumbs {
      display: flex;
      list-style: none;
      justify-content: flex-start;
    }
  </style>
</gb-breadcrumbs>
