<gb-breadcrumbs>
  <ul class="gb-breadcrumbs { opts.style() } ">
    <li each={ nav in selected }>
      <ul class="gb-nav-crumb">
        <gb-refinement-crumb each={ ref in nav.refinements }></gb-refinement-crumb>
      </ul>
    </li>
  </ul>

  <script>
    require('./gb-refinement-crumb.tag');

    opts.flux.on(opts.flux.REFINEMENTS_CHANGED, ({ selected }) => this.update({ selected }));
    opts.flux.on(opts.flux.RESET, () => this.update({ selected: [] }));
  </script>

  <style scoped>
    .gb-stylish.gb-breadcrumbs {
      display: flex;
      list-style: none;
    }
    .gb-stylish.gb-breadcrumbs > li {
      flex: 1;
    }
  </style>
</gb-breadcrumbs>
