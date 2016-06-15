<gb-query>
  <input class="gb-search-box { opts.stylish ? 'gb-stylish' : '' }" type="text" name="searchBox" oninput="{ updateResults }" placeholder="Search...">

  <script>
    this.updateResults = () => opts.flux.search(this.searchBox.value)
      .then(() => opts.srch.trigger());
    opts.flux.on('reset', () => this.searchBox.value = opts.flux.query.build().query);
  </script>

  <style scoped>
    .gb-stylish.gb-search-box {
      padding: 6px 12px;
      font-size: 14px;
    }
  </style>
</gb-query>
