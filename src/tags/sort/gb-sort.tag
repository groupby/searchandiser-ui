<gb-sort>
  <yield>
    <!-- figure out why we need this scope here (otherwise gets an empty) -->
    <gb-select scope="gb-sort">
    </gb-select>
  </yield>

  <script>
    import '../select/gb-select.tag';
    import { Sort } from './gb-sort';
    this.mixin(new Sort().__proto__);
  </script>
</gb-sort>
