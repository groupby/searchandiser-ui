<gb-page-size>
  <select class="gb-page-size" name="select" onchange={ updatePageSize }>
    <option each={ size in pageSizes } value={ size }>{ size }</option>
  </select>

  <script>
    this.pageSizes = opts.config.pageSizes || [10, 25, 50, 100];
    const resetOffset = opts.resetOffset;
    this.updatePageSize = event => opts.flux.resize(event.target.value, resetOffset ? 0 : undefined);

    if (!opts.native) {
      require('tether-select/dist/css/select-theme-default.css');
      this.on('mount', () => new (require('tether-select'))({ el: this.select }));
    }
  </script>
</gb-page-size>
