<gb-available-navigation>
  <div class="gb-side-nav { opts.style() }">
    <div class="gb-nav" each={ name, nav in processed }>
      <h4 class="gb-nav__title">{ nav.displayName }</h4>
      <ul class="gb-nav__list">
        <gb-selected-refinement if={ showSelected } each={ ref in nav.selected }></gb-selected-refinement>
        <gb-available-refinement each={ ref in nav.available }></gb-available-refinement>
      </ul>
    </div>
  </div>

  <script>
    require('./gb-available-refinement.tag');
    require('./gb-selected-refinement.tag');

    this.badge = opts.badge === undefined ? true : opts.badge;
    this.showSelected = opts.showSelected === undefined ? true : opts.showSelected
    this.processNavigations = res => {
      return res.selectedNavigation
        .map(nav => Object.assign(nav, { selected: true }))
        .concat(res.availableNavigation)
        .reduce(this.combineNavigations, {});
    };
    this.combineNavigations = (processed, nav) => Object.assign(processed, { [nav.name]: Object.assign(processed[nav.name] ? processed[nav.name] : nav, { [nav.selected ? 'selected' : 'available']: nav.refinements }) });
    opts.flux.on(opts.flux.RESULTS, res => this.update({ processed: this.processNavigations(res) }));
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
