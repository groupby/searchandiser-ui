<gb-record-count>
  <h2>{ first } - { last } of { total } Products</h2>

  <script>
    opts.srch.el.on('results', () => {
      this.first = opts.srch.results.pageInfo.recordStart;
      this.last = opts.srch.results.pageInfo.recordEnd;
      this.total = opts.srch.results.totalRecordCount;
      this.update();
    });
  </script>
</gb-record-count>
