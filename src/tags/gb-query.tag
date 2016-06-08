<gb-query>
  <input class="gb-search-box { opts.stylish ? 'gb-stylish' : '' }" type="text" name="searchBox" oninput="{ updateResults }" placeholder="Search...">

  <script>
    this.updateResults = () => {
      opts.srch.search(this.searchBox.value);
    };
    opts.srch.el.on('results', () => {
      this.searchBox.value = opts.srch.query.build().query;
    });
  </script>

  <style scoped>
    .gb-stylish.gb-search-box {
      padding: 6px 12px;
      font-size: 14px;
    }
  </style>
</gb-query>
