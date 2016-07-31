<gb-raw-sort>
  <gb-raw-select class="gb-sort" passthrough={ passthrough }>
    <yield/>
  </gb-raw-select>

  <script>
    import { Sort } from './gb-sort';
    this.mixin(new Sort().__proto__);
  </script>
</gb-raw-sort>
