<gb-record-count>
  <yield>
    <h2>{ first } - { last } of { total } Products</h2>
  </yield>

  <script>
    import { RecordCount } from './gb-record-count';
    this.mixin(new RecordCount().__proto__);
  </script>
</gb-record-count>
