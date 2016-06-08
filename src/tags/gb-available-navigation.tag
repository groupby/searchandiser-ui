<gb-available-navigation>
  <div class="gb-side-nav { stylish ? 'gb-stylish' : '' }">
    <div class="gb-nav" each={ nav in availableNavigation }>
      <h4 class="gb-nav__title">{ nav.displayName }</h4>
      <ul class="gb-nav__list">
        <gb-available-refinement each={ ref in nav.refinements } srch={ srch } ref={ ref }></gb-available-refinement>
      </ul>
    </div>
  </div>

  <script>
    require('./gb-available-refinement.tag');

    this.srch = opts.srch;
    this.stylish = opts.stylish;
    this.badge = opts.badge === undefined ? true : opts.badge;

    opts.srch.el.on('results', () => {
      this.availableNavigation = opts.srch.results.availableNavigation;
      this.update();
    });
  </script>

  <style scoped>
    .gb-stylish h4 {
      font-size: 18px;
      margin: 10px 0;
    }

    .gb-stylish.gb-side-nav {
      padding: 12px;
    }

    .gb-stylish .gb-nav__list {
      margin: 0;
      padding-left: 8px;
    }
  </style>
</gb-available-navigation>
