<gb-product>
  <div class="gb-product">
    <a class="gb-product__image-link" href={ link(allMeta) }>
      <img class="gb-product__image" src={ image(getPath(allMeta, struct.image)) } alt=""/>
    </a>
    <a class="gb-product__info-link" href={ link(allMeta) }>
      <p class="gb-product__title">{ getPath(allMeta, struct.title) }</p>
      <p class="gb-product__price">{ getPath(allMeta, struct.price) }</p>
    </a>
  </div>

  <script>
    import { Product } from './gb-product';
    this.mixin(new Product().__proto__);
  </script>
</gb-product>
