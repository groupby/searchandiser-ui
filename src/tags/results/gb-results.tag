<gb-results>
  <gb-raw-results flux={ opts.flux }>
    <gb-product></gb-product>
  </gb-raw-results>

  <script>
    import './gb-raw-results.tag';
    import './gb-product.tag';

    this.struct = opts.config.structure;
  </script>
</gb-results>
