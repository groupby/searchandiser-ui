<gb-refinement-crumb>
  <a onclick={ _scope.remove }>&times;</a> <b>{ opts.navigation.displayName }: { toView(item) }</b>

  <script>
    import { RefinementCrumb } from './gb-refinement-crumb';
    this.mixin(new RefinementCrumb().__proto__);
  </script>
</gb-refinement-crumb>
