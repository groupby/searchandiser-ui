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

  <style scoped>
    .gb-stylish {
      list-style: none;
    }

    .gb-stylish .gb-filler {
      flex-grow: 1;
    }

    .gb-stylish .gb-ref__link {
      display: flex;
      padding: 4px 6px;
      border-radius: 4px;
      color: black;
      font-size: 14px;
      text-decoration: none;
      align-items: baseline;
    }

    .gb-stylish .gb-ref__link:hover {
      background-color: #ddd;
    }

    .gb-stylish .gb-ref__badge {
      display: inline-block;
      min-width: 10px;
      max-height: 20px;
      padding: 4px 7px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: bold;
      line-height: 1;
      color: #fff;
      background-color: #ccc;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
    }
  </style>
</gb-raw-available-refinement>
