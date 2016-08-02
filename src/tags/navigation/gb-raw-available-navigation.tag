<gb-raw-available-navigation>
<yield/>

  <script>
/*
Available options:  
badge
showSelected
*/
  import { Navigation } from './gb-navigation';
  import { displayRefinement } from '../../utils'
  import './gb-raw-available-refinement.tag'
  import './gb-raw-selected-refinement.tag'

  this.mixin(new Navigation().__proto__);
  this.toView = displayRefinement;
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
</gb-raw-available-navigation>
