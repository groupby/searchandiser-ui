<gb-raw-results>
  <ul class="gb-results { this.parent.opts.style() } { userStyle('results') }">
    <li class="gb-results__item { userStyle('resultsItem') }" each="{ records }">
      <div class="gb-product { userStyle('product') }">
        <yield/>
      </div>
    </li>
  </ul>

  <script>
    this.struct = this.parent ? this.parent.struct : opts.config.structure;
    const css = opts.css;
    console.log(css);
    opts.flux.on(opts.flux.RESULTS, res => this.update({ records: res.records }));
    this.userStyle = key => css ? css[key]: '';
  </script>

  <style scoped>
    .gb-stylish.gb-results {
      list-style: none;
    }

    .gb-stylish .gb-product {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
  </style>
</gb-raw-results>
