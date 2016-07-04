<gb-record-count>
  <yield/>

  <script>
    opts.flux.on(opts.flux.RESULTS, res => this.update({
      first: res.pageInfo.recordStart,
      last: res.pageInfo.recordEnd,
      total: res.totalRecordCount
    }));
  </script>
</gb-record-count>
