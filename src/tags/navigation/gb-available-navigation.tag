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
    import './gb-available-refinement.tag';
    import './gb-selected-refinement.tag';
    import { Navigation } from './gb-navigation';
    this.mixin(new Navigation());
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
