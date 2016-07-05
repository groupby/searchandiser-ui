<gb-product>
  <div class="gb-product">
    <a class="gb-product__image-link" href="#">
      <img class="gb-product__image" src={ isImageArray() ? allMeta[struct.image][0] : allMeta[struct.image] } alt="" />
    </a>
    <a class="gb-product__info-link" href="#">
      <p>{ allMeta[struct.title] }</p>
<div hide={ allMeta[struct.salePrice] != allMeta[struct.price] }>
      <p>{ allMeta[struct.price] }</p>
</div>
<div if={ allMeta[struct.salePrice] != allMeta[struct.price]}>
      <p style="text-decoration: line-through">{ allMeta[struct.price] }</p>
      <p style="color: red">{ allMeta[struct.salePrice] }</p>
</div>
    </a>
  </div>

  <script>
    this.struct = this.parent.struct;
    this.isImageArray = () => Array.isArray(this.allMeta[this.struct.image]);
  </script>
</gb-product>
