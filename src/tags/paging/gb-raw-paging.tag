<gb-raw-paging>
  <div class="gb-raw-paging { _style }">
    <yield/>
  </div>

  <script>
    import { Paging } from './gb-paging';
    this.mixin(new Paging().__proto__);
  </script>
</gb-raw-paging>
