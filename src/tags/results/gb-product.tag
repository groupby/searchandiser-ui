<gb-product>
  <div class="gb-product">
    <a class="gb-product__image-link" href={ link() }>
      <img class="gb-product__image" src={ image(get(struct.image)) } alt=""/>
    </a>
    <a class="gb-product__info-link" href={ link() }>
      <p class="gb-product__title">{ get(struct.title) }</p>
      <p class="gb-product__price">{ get(struct.price) }</p>
    </a>
    <!--
    <a each={ variant,i in [0,1,2,3] } onclick={ switchVariant } data-index={ i }>
      { console.log(this); }
    </a>
  -->
  </div>

  <script>
    import { Product } from './gb-product';
    this.mixin(new Product().__proto__);
  </script>
</gb-product>
