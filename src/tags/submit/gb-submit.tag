<gb-submit>
  <yield>
    <a class="gb-submit { _style }">&#128269;</a>
  </yield>

  <script>
    import { Submit } from './gb-submit';
    this.mixin(new Submit().__proto__);
  </script>

  <style scoped>
    .gb-stylish.gb-submit {
      padding: 4px;
    }
    .gb-stylish.gb-submit:hover {
      cursor: pointer;
    }
  </style>
</gb-submit>
