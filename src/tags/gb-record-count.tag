<gb-record-count>
  <yield/>

  <script>
    opts.flux.on(opts.flux.RESULTS, ({ pageInfo, totalRecordCount }) => this.update({
      first: pageInfo.recordStart,
      last: pageInfo.recordEnd,
      total: totalRecordCount
    }));
  </script>
</gb-record-count>
