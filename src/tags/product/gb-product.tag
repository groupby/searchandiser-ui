<gb-product>
  <yield>
    <gb-product-image></gb-product-image>
    <gb-product-info></gb-product-info>
  </yield>

  <script>
    import './gb-product-image.tag';
    import './gb-product-info.tag';
    import { Product } from './gb-product';
    this.mixin(new Product().__proto__);
  </script>
</gb-product>
