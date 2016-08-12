<gb-page-size>
  <yield>
    <gb-select>
    </gb-select>
  </yield>

  <script>
    import '../select/gb-select.tag';
    import { PageSize } from './gb-page-size';
    this.mixin(new PageSize().__proto__);
  </script>
</gb-page-size>
