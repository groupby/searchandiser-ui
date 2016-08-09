<gb-product>
  <yield>
    <gb-product-image></gb-product-image>
    <gb-product-info></gb-product-info>
    <a each={ variant,i in variants } class="gb-product__variant-link" onclick={ switchVariant } data-index={ i }>
      { JSON.stringify(variant) }
    </a>
  </yield>

  <script>
    import './gb-product-image.tag';
    import './gb-product-info.tag';
    import { Product } from './gb-product';
    this.mixin(new Product().__proto__);
  </script>
</gb-product>
