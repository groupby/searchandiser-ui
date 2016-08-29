<gb-sayt-products>
  <ul class={ _style }>
    <li class="gb-sayt-product" each={ products }>
      <gb-product all_meta={ allMeta }>
        <gb-product-image thumbnail></gb-product-image>
      </gb-product>
    </li>
  </ul>

  <script>
    import '../product/gb-product.tag';
    import '../product/gb-product-image.tag';
    this._scopeTo('gb-sayt')
  </script>

  <style scoped>
    .gb-stylish :scope {
      min-width: 300px;
    }

    ul.gb-stylish {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      width: calc(86px * 4);
      align-content: flex-start;
    }
    .gb-stylish gb-product-image img {
      vertical-align: bottom;
      margin: 3px;
    }
    .gb-stylish gb-product-image img:hover {
      box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    }
  </style>
</gb-sayt-products>
