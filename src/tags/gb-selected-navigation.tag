<gb-selected-navigation>
  <ul class="gb-list">
    <li each={ nav in selected }>
      <ul class="gb-list">
        <gb-selected-refinement each={ ref in nav.refinements }></gb-selected-refinement>
      </ul>
    </li>
  </ul>

  <script>
    require('./gb-selected-refinement.tag');

    opts.flux.on(opts.flux.REFINEMENTS_CHANGED, ({ selected }) => this.update({ selected }));
    opts.flux.on(opts.flux.RESET, res => this.update({ selected: res.selected }));
  </script>
</gb-selected-navigation>
