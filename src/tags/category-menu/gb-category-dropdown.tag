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
    const sayt = require('sayt');
    this.parentOpts = this.parent.opts;
    const saytConfig = Object.assign({ products: 4 }, this.parentOpts.config.sayt);

    sayt.configure({
      subdomain: this.parentOpts.config.customerId,
      collection: this.parentOpts.config.collection,
      autocomplete: { },
      productSearch: { area: this.parentOpts.config.area, numProducts: saytConfig.products }
    });

    this.updateSectionImages = event => console.dir(event.target);
    this.updateCategoryImages = event => console.dir(event.target);
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
