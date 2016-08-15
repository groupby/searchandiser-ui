<gb-product-info>
  <a href={ _scope.link() }>
    <p class="gb-product__title">{ _scope.get(_scope.struct.title) }</p>
    <p class="gb-product__price">{ _scope.get(_scope.struct.price) }</p>
  </a>

  <script>
    this._scopeTo('gb-product');
  </script>
</gb-product-info>
