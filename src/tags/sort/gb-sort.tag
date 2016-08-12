<gb-sort>
  <yield>
    <gb-select>
    </gb-select>
  </yield>

  <script>
    import '../select/gb-select.tag';
    import { Sort } from './gb-sort';
    this.mixin(new Sort().__proto__);
  </script>
</gb-sort>
