<gb-breadcrumbs>
  <ul class="gb-list">
    <li each={ nav in selected }>
      <ul class="gb-list">
        <gb-refinement-crumb each={ ref in nav.refinements }></gb-refinement-crumb>
      </ul>
    </li>
  </ul>

  <script>
    require('./gb-refinement-crumb.tag');

    opts.flux.on(opts.flux.REFINEMENTS_CHANGED, ({ selected }) => this.update({ selected }));
    opts.flux.on(opts.flux.RESET, res => this.update({ selected: res.selected }));
  </script>
</gb-breadcrumbs>
