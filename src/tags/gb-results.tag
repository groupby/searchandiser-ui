<gb-results>
  <gb-raw-results flux={ opts.flux }>
    <gb-product></gb-product>
  </gb-raw-results>

  <script>
    require('./gb-raw-results.tag');
    require('./gb-product.tag');

    this.struct = opts.config.structure;
  </script>
</gb-results>
