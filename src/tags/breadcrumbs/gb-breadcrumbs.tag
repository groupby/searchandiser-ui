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
    const { REFINEMENTS_CHANGED, RESULTS, RESET } = opts.flux;
    this.hideQuery = opts.hideQuery === undefined ? false : opts.hideQuery;
    this.hideRefinements = opts.hideRefinements === undefined ? false : opts.hideRefinements;

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
