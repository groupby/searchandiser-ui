<gb-query>
  <input type="text" name="searchBox" oninput="{ updateResults }" placeholder="Search...">

  <script>
    this.updateResults = () => {
      opts.srch.search(this.searchBox.value);
    };
    opts.srch.el.on('results', () => {
      this.searchBox.value = opts.srch.query.build().query;
    });
  </script>
</gb-query>
