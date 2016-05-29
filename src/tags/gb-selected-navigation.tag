<gb-selected-navigation>
  <ul class="gb-list">
    <li each={ nav in selectedNavigation } nav={ nav }>
      <ul class="gb-list">
        <gb-selected-refinement each={ ref in nav.refinements } nav={ nav } ref={ ref } srch={ srch }></gb-selected-refinement>
      </ul>
    </li>
  </ul>

  <script>
  require('./gb-selected-refinement.tag');

  this.srch = opts.srch;
  opts.srch.el.on('results', () => {
    this.selectedNavigation = opts.srch.results.selectedNavigation;
    this.update();
  });
  </script>
</gb-selected-navigation>
