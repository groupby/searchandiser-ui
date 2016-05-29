<gb-results>
  <h2>Results ({ total })</h2>
  <div each="{ records }">
    <a href="#">
      <img src="{ allMeta[struct.image] }" alt="" />
    </a>
    <a href="#">
      <p>{ allMeta[struct.title] }</p>
      <p>{ allMeta[struct.price] }</p>
    </a>
  </div>

  <script>
    this.struct = opts.srch.CONFIG.structure;

    opts.srch.el.on('results', () => {
      this.records = opts.srch.results.records;
      this.total = opts.srch.results.totalRecordCount;
      this.update();
    });
  </script>
</gb-results>
