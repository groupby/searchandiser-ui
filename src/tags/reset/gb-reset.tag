<gb-reset>
  <yield>
    <a class="gb-reset">&times;</a>
  </yield>

  <script>
    import { Reset } from './gb-reset';
    this.mixin(new Reset().__proto__);
  </script>

  <style scoped>
    .gb-stylish .gb-reset {
      color: #888;
      padding: 4px;
    }
    .gb-stylish .gb-reset:hover {
      color: black;
      cursor: pointer;
    }
  </style>
</gb-reset>
