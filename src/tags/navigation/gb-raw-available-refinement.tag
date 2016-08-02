<gb-raw-available-refinement>
  <yield/>

  <script>
  /*
  Exposed methods:
  toView(ref)
  send

  Exposed objects: 
  ref
  */
    import { Refinement } from './gb-refinement';
    this.mixin(new Refinement().__proto__);
    this.send = () => this.parentOpts.flux.refine(this.toRefinement(this.ref, this.nav));
  </script>
</gb-raw-available-refinement>
