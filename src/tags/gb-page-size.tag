<gb-page-size>
  <select class="gb-page-size" onchange={ updatePageSize }>
    <option each={ size in pageSizes }>{ size }</option>
  </select>
  <span>product per page</span>

  <script>
    this.pageSizes = opts.config.pageSizes || [10, 25, 50, 100];
    this.updatePageSize = event => opts.flux.resize(event.target.value);
  </script>
</gb-page-size>
