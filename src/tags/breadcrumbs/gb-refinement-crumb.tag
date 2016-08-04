<gb-refinement-crumb>
  <li class="gb-refinement-crumb { _style }">
    <a onclick={ remove }>&times;</a> <b>{ nav.displayName }: { toView(ref) }</b>
  </li>

  <script>
    import { RefinementCrumb } from './gb-refinement-crumb';
    this.mixin(new RefinementCrumb().__proto__);
  </script>

  <style>
    .gb-stylish.gb-refinement-crumb {
      display: flex;
    }

    .gb-stylish.gb-refinement-crumb a {
      cursor: pointer;
    }
  </style>
</gb-refinement-crumb>
