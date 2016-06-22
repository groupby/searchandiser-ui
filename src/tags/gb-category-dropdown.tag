<gb-category-dropdown>
  <div class="gb-dropdown { parentOpts.style() }">
    <button type="button" class="gb-dropdown__button">{ name }</button>
    <div class="gb-dropdown__content">
      <gb-category-section if={ items }></gb-category-section>
      <gb-category-section each={ subsections } named={ true }></gb-category-section>
    </div>
    <div class="gb-dropdown__images">
      <img src="" each={ results.images } />
    </div>
  </div>

  <script>
    const { Query, BrowserBridge } = require('groupby-api').Query;
    this.parentOpts = this.parent.opts;
    this.cached = {};

    this.updateIt = opts => {
      const query = new Query(opts.query ? opts.query : '');
      if (opts.refinements) {
        query.withSelectedRefinements(...opts.refinements);
      }
      // this.update({ results:  })
    };
  </script>

  <style scoped>
    .gb-dropdown {
      position: relative;
      display: inline-block;
    }

    .gb-dropdown__content {
      display: none;
      position: absolute;
      min-width: 160px;
      background-color: #fff;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    }

    .gb-dropdown:hover .gb-dropdown__content {
      display: block;
    }

    .gb-stylish .gb-dropdown__button {
      border: none;
      cursor: pointer;
      padding: 16px;
      width: 100%;
    }

    .gb-stylish .gb-dropdown__content {
      flex-wrap: wrap;
      background-color: #f9f9f9;
      min-width: 272px;
    }

    .gb-stylish.gb-dropdown:hover .gb-dropdown__content {
      display: flex;
    }
  </style>
</gb-category-dropdown>
