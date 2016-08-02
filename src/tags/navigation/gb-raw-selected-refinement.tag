<gb-raw-selected-refinement>
  <yield/>
  <script>
/* Exposed methods:
toView(ref)
remove()

Exposed objects:
ref
*/

    import { Refinement } from './gb-refinement';
    this.mixin(new Refinement().__proto__);
    this.remove = () => this.parentOpts.flux.unrefine(this.toRefinement(this.ref, this.nav));
  </script>
</gb-raw-selected-refinement>
