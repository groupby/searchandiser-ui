<gb-results>
  <yield>
    <gb-list items={ records }>
      <gb-product all_meta={ item.allMeta }></gb-product>
    </gb-list>
  </yield>

  <script>
    import '../list/gb-list.tag';
    import '../product/gb-product.tag';
    import { Results } from './gb-results';
    this.mixin(new Results().__proto__);
  </script>

  <style scoped>
    .gb-stylish gb-list {
      padding: 0;
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
    }

    .gb-stylish gb-product {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
  </style>
</gb-results>
