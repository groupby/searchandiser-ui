<gb-raw-page-size>
  <gb-raw-select class="gb-page-size" passthrough={ passthrough }>
    <yield/>
  </gb-raw-select>

  <script>
    import '../select/gb-raw-select.tag';
    import { PageSize } from './gb-page-size';
    this.mixin(new PageSize().__proto__);
  </script>
</gb-raw-page-size>
