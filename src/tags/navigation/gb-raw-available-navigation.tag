<gb-raw-available-navigation>
<yield/>

  <script>
  import { Navigation } from './gb-navigation';
  import { displayRefinement } from '../../utils'
  import './gb-raw-available-refinement.tag'
  import './gb-raw-selected-refinement.tag'

  this.mixin(new Navigation().__proto__);
  this.toView = displayRefinement;
  </script>
</gb-raw-available-navigation>
