<gb-raw-results>
  <ul class="gb-results { this.parent.opts.style() } { userStyle('results') }">
    <li class="gb-results__item { userStyle('resultsItem') }" each={ records }>
      <div class="gb-product { userStyle('product') }">
        <yield/>
      </div>
    </li>
  </ul>

  <script>
    this.struct = this.parent ? this.parent.struct : opts.config.structure;
    const css = opts.css;
    opts.flux.on(opts.flux.RESULTS, ({ records }) => this.update({ records }));
    this.userStyle = (key) => css ? css[key]: '';
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
