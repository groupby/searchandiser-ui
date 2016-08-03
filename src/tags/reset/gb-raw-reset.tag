<gb-raw-reset>
  <yield/>

  <script>
    import { Reset } from './gb-reset';
    this.mixin(new Reset().__proto__);
  </script>
</gb-raw-reset>
