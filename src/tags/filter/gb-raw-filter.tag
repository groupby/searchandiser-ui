<gb-raw-filter>
  <gb-raw-select name="selectElement" passthrough={ passthrough }>
    <yield/>
  </gb-raw-select>

  <script>
    import { Filter } from './gb-filter';
    this.mixin(new Filter().__proto__);
  </script>
</gb-raw-filter>
