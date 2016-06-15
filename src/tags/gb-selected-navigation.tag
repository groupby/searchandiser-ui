<gb-selected-navigation>
  <ul class="gb-list">
    <li each={ nav in selectedNavigation } nav={ nav }>
      <ul class="gb-list">
        <gb-selected-refinement each={ ref in nav.refinements } nav={ nav } ref={ ref } srch={ srch } flux={ flux }></gb-selected-refinement>
      </ul>
    </li>
  </ul>

  <script>
    require('./gb-selected-refinement.tag');

    this.srch = opts.srch;
    this.flux = opts.flux;
    opts.flux.on('results', () => this.update({ selectedNavigation: opts.flux.results.selectedNavigation }));
  </script>
</gb-selected-navigation>
