<gb-page-size>
  <select class="gb-page-size" onchange={ updatePageSize }>
    <option each={ size in pageSizes }>{ size }</option>
  </select>
  <span>product per page</span>

  <script>
    this.pageSizes = opts.config.pageSizes || [10, 25, 50, 100];
    const resetOffset = opts.resetOffset;
    this.updatePageSize = event => opts.flux.resize(event.target.value, resetOffset ? 0 : undefined);
  </script>
</gb-page-size>
