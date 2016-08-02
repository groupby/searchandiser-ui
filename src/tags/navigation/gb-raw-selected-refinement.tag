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

  <style scoped>
    .gb-stylish {
      position: relative;
      list-style: none;
      padding: 4px 6px;
      font-size: 14px;
    }

    .gb-stylish .gb-ref__link {
      left: -8px;
      position: absolute;
      color: black;
      text-decoration: none;
    }

    .gb-stylish .gb-ref__link:hover {
      color: red;
      font-weight: bold;
    }
  </style>
</gb-raw-selected-refinement>
