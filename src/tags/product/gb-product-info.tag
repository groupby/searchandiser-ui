<gb-product-info>
  <a href={ _scope.link() }>
    <p class="gb-product__title">{ _scope.currentVariant().title }</p>
    <p class="gb-product__price">{ _scope.currentVariant().price }</p>
  </a>

  <script>
    this._scopeTo('gb-product');
  </script>
</gb-product-info>
