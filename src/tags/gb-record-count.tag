<gb-record-count>
  <h2>{ first } - { last } of { total } Products</h2>

  <script>
    opts.flux.on(opts.flux.RESULTS, () => this.update({
      first: opts.flux.results.pageInfo.recordStart,
      last: opts.flux.results.pageInfo.recordEnd,
      total: opts.flux.results.totalRecordCount
    }));
  </script>
</gb-record-count>
