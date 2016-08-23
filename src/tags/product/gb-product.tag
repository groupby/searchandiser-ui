<gb-product>
  <yield>
    <gb-product-image></gb-product-image>
    <gb-product-info></gb-product-info>
    <gb-variant-switcher></gb-variant-switcher>
  </yield>

  <script>
    import './gb-product-image.tag';
    import './gb-product-info.tag';
    import './gb-variant-switcher.tag';
    import { Product } from './gb-product';
    this._mixin(Product);
  </script>
</gb-product>
