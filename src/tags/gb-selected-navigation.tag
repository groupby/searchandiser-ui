<gb-selected-navigation>
  <ul class="gb-list">
    <li each={ nav in selected } nav={ nav }>
      <ul class="gb-list">
        <gb-selected-refinement each={ ref in nav.refinements } ref={ ref }></gb-selected-refinement>
      </ul>
    </li>
  </ul>

  <script>
    require('./gb-selected-refinement.tag');

    this.flux = opts.flux;
    opts.flux.on(opts.flux.REFINEMENTS_CHANGED, ({ selected }) => this.update({ selected }));
    opts.flux.on(opts.flux.RESET, () => this.update({ selected: opts.flux.results.selected }));
  </script>
</gb-selected-navigation>
