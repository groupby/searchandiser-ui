<gb-raw-page-size>
  <gb-raw-select class="gb-page-size" passthrough={ passthrough }>
    <yield/>
  </gb-raw-select>

  <script>
    const parentOpts = opts.passthrough || opts;
    this.passthrough = Object.assign({}, parentOpts.__proto__, {
      options: parentOpts.config.pageSizes || [10, 25, 50, 100],
      hover: parentOpts.onHover,
      update: (value) => parentOpts.flux.resize(value, parentOpts.resetOffset ? 0 : undefined),
      default: true
    });
  </script>
</gb-raw-page-size>
