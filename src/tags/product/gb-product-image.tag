<gb-product-image>
  <a class="gb-product-image { _style }" href={ _scope.link() }>
    <img class={ thumbnail: opts.thumbnail !== undefined } src={ imageLink() } alt=""/>
  </a>

  <script>
    this._scopeTo('gb-product');
    const _scope = this._scope;
    this.imageLink = () => _scope.image(_scope.productMeta().image);
  </script>

  <style scoped>
    .gb-product-image.gb-stylish img {
      width: 380px;
    }
    .gb-product-image.gb-stylish img.thumbnail {
      width: 80px;
    }
  </style>
</gb-product-image>
