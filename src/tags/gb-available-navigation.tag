<gb-available-navigation>
  <h3>Available Navigation</h3>
  <ul>
    <li each={ nav in availableNavigation }>
      <h4>{ nav.displayName }</h4>
      <ul>
        <gb-available-refinement each={ ref in nav.refinements } srch={ srch } nav={ nav } ref={ ref }></gb-available-refinement>
      </ul>
    </li>
  </ul>

  <script>
    require('./gb-available-refinement.tag');

    this.srch = opts.srch;
    opts.srch.el.on('results', () => {
      this.availableNavigation = opts.srch.results.availableNavigation;
      this.update();
    });
  </script>
</gb-available-navigation>
