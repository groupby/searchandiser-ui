<gb-raw-navigation>
  <yield/>

  <script>
    import {RawNavigation} from './gb-raw-navigation';
    console.log('loading raw nav');

    this.mixin(new RawNavigation().__proto__);

    this.send   = (ref, nav) => () => this.flux.refine(this.toRefinement(ref, nav));
    this.remove = (ref, nav) => () => this.flux.unrefine(this.toRefinement(ref,nav));
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
