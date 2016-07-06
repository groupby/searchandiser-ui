<gb-page-size>
  <gb-select class="gb-page-size" options={ pageSizes } native={ opts.native } default="true" update={ updatePageSize }></gb-select>

  <script>
    this.pageSizes = opts.config.pageSizes || [10, 25, 50, 100];
    const resetOffset = opts.resetOffset;
    this.updatePageSize = (value) => opts.flux.resize(value, resetOffset ? 0 : undefined);
  </script>
</gb-page-size>
