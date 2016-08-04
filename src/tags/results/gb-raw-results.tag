<gb-raw-results>
  <ul class="gb-results { _style } { userStyle('results') }">
    <li class="gb-results__item { userStyle('resultsItem') }" each={ records }>
      <div class="gb-product { userStyle('product') }">
        <yield/>
      </div>
    </li>
  </ul>

  <script>
    import { Results } from './gb-results';
    this.mixin(new Results().__proto__);
  </script>

  <style scoped>
    .gb-stylish.gb-results {
      padding: 0;
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
    }

    .gb-stylish .gb-product {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .gb-stylish .gb-product .gb-product__image {
      width: 380px;
    }
  </style>
</gb-raw-results>
