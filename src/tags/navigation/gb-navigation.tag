<gb-navigation>
  <yield>
    <div class="gb-side-nav { _style }">
      <gb-refinement-list each={ nav in processed }></gb-refinement-list>
    </div>
  </yield>

  <script>
    import './gb-refinement-list.tag';
    import './gb-available-refinement.tag';
    import './gb-selected-refinement.tag';
    import { Navigation } from './gb-navigation';
    this.mixin(new Navigation().__proto__);
  </script>

  <style scoped>
    .gb-stylish.gb-side-nav {
      padding: 12px;
    }
  </style>
</gb-navigation>
