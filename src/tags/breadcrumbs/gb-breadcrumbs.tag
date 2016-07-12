<gb-breadcrumbs>
  <ul class="gb-breadcrumbs { opts.style() }">
    <li if={ !hideQuery && query }>{ query }</li>
    <li if={ !hideRefinements } each={ nav in selected }>
      <ul class="gb-nav-crumb">
        <gb-refinement-crumb each={ ref in nav.refinements }></gb-refinement-crumb>
      </ul>
    </li>
  </ul>

  <script>
    require('./gb-refinement-crumb.tag');
    this.hideQuery = opts.hideQuery === undefined ? false : opts.hideQuery;
    this.hideRefinements = opts.hideRefinements === undefined ? false : opts.hideRefinements;

    opts.flux.on(opts.flux.REFINEMENTS_CHANGED, ({ selected }) => this.update({ selected }));
    opts.flux.on(opts.flux.RESULTS, (res) => this.update({ query: res.originalQuery }));
    opts.flux.on(opts.flux.RESET, (res) => this.update({ selected: [] }));
  </script>

  <style scoped>
    .gb-stylish.gb-breadcrumbs {
      display: flex;
      list-style: none;
      justify-content: flex-start;
    }
  </style>
</gb-breadcrumbs>
