<gb-product>
  <div class="gb-product">
    <a class="gb-product__image-link" href={ link(allMeta.id) }>
      <img class="gb-product__image" src={ isImageArray() ? allMeta[struct.image][0] : allMeta[struct.image] } alt="" />
    </a>
    <a class="gb-product__info-link" href={ link(allMeta.id) }>
      <p>{ allMeta[struct.title] }</p>
      <p>{ allMeta[struct.price] }</p>
    </a>
  </div>

  <script>
    this.struct = this.parent.struct;
    this.link = (id) => this.struct.url || `details.html?id=${id}`;
    this.isImageArray = () => Array.isArray(this.allMeta[this.struct.image]);
  </script>
</gb-product>
