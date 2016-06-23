<gb-product>
  <a href="#">
    <img src={ allMeta[struct.image] } alt="" />
  </a>
  <a href="#">
    <p>{ allMeta[struct.title] }</p>
    <p>{ allMeta[struct.price] }</p>
  </a>

  <script>
    this.struct = this.parent.struct;
    this.isImageArray = () => Array.isArray(this.allMeta[this.struct.image]);
  </script>
</gb-product>
