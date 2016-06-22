<gb-available-navigation>
  <div class="gb-side-nav { opts.style() }">
    <div class="gb-nav" each={ nav in available }>
      <h4 class="gb-nav__title">{ nav.displayName }</h4>
      <ul class="gb-nav__list">
        <gb-available-refinement each={ ref in nav.refinements }></gb-available-refinement>
      </ul>
    </div>
  </div>

  <script>
    require('./gb-available-refinement.tag');
    this.badge = opts.badge === undefined ? true : opts.badge;

    opts.flux.on(opts.flux.RESULTS, res => this.update({ available: res.availableNavigation }));
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
