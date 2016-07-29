<gb-product>
  <div class="gb-product">
    <a class="gb-product__image-link" href={ link(allMeta.id) }>
      <img class="gb-product__image" src={ image(getPath(allMeta, struct.image)) } alt=""/>
    </a>
    <a class="gb-product__info-link" href={ link(allMeta.id) }>
      <p>{ getPath(allMeta, struct.title) }</p>
      <p>{ getPath(allMeta, struct.price) }</p>
    </a>
  </div>

  <script>
    import { Product } from './gb-product';
    this.mixin(new Product().__proto__);
  </script>
</gb-product>
