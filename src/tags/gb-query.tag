<gb-query>
  <div class="gb-query { opts.style() }">
    <input class="gb-query__box" type="text" placeholder="Search...">
    <a class="gb-query__reset" onclick={ clearQuery }>×</a>
  </div>

  <script>
    this.on('before-mount', () => riot.mount('gb-raw-query', '.gb-query__box', opts));
  </script>

  <style scoped>
    .gb-stylish .gb-query__box {
      padding: 6px 12px;
      font-size: 14px;
    }
    .gb-stylish .gb-query__reset {
      color: #888;
    }
    .gb-stylish .gb-query__reset:hover {
      color: black;
      cursor: pointer;
    }
  </style>
</gb-query>
