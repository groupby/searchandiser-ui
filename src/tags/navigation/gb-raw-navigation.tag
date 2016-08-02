<gb-raw-navigation>
  <div class="gb-side-nav { opts.style() }">
    <div class="gb-nav" each={ name, nav in processed }>
      <yield/>
    </div>
  </div>

  <script>
    import { RawNavigation } from './gb-raw-navigation';
    console.log('loading raw nav');

    this.mixin(new RawNavigation().__proto__);

    this.send = () => this.opts.flux.refine(this.toRefinement(this.ref, this.nav));
    this.remove = () => this.opts.flux.unrefine(this.toRefinement(this.ref, this.nav));
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
</gb-raw-navigation>
