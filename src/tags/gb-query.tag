<gb-query>
  <div class="gb-query { opts.style() }">
    <input class="gb-query__box" name="searchBox" type="text" placeholder="Search..." autofocus>
    <a class="gb-query__reset" onclick={ clearQuery }>&times;</a>
  </div>

  <script>
    this.on('mount', () => riot.mount('.gb-query__box', 'gb-raw-query', opts));
    this.clearQuery = () => opts.flux.reset(this.searchBox.value = '');
  </script>

  <style scoped>
    .gb-stylish.gb-query {
      display: flex;
      align-items: baseline;
    }
    .gb-stylish .gb-query__box {
      padding: 6px 12px;
      font-size: 14px;
    }
    .gb-stylish .gb-query__reset {
      color: #888;
      padding: 4px;
    }
    .gb-stylish .gb-query__reset:hover {
      color: black;
      cursor: pointer;
    }
  </style>
</gb-query>
