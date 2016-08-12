<gb-filter>
  <yield>
    <gb-select>
    </gb-select>
  </yield>

  <script>
    import '../select/gb-select.tag';
    import { Filter } from './gb-filter';
    this.mixin(new Filter().__proto__);
  </script>
</gb-filter>
