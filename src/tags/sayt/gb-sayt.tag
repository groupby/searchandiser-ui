<gb-sayt>
  <div class="gb-sayt { _style }" name="saytNode" if={ queries || navigations }>
    <ul class="gb-sayt__autocomplete" name="autocompleteList">
      <li class="gb-autocomplete__item" each={ query in categoryResults } data-value={ query.value } data-refinement={
          query.category } data-field={ categoryField }>
        <a class="gb-autocomplete__link" href="#" onclick={ searchCategory }>
          <b>{ query.value }</b> in <span class="gb-category-query">{ query.category }</span>
        </a>
      </li>
      <div if={ queries && categoryResults.length } class="gb-autocomplete__divider"></div>
      <gb-list class="gb-autocomplete-items" items={ queries } scope="gb-sayt">
        <gb-autocomplete-link send={ _scope.search } data-value="{ item.value }">
            <gb-raw content={ _scope.highlightCurrentQuery(item.value, '<b>$&</b>') }></gb-raw>
        </gb-autocomplete-link>
      </gb-list>
      <div if={ queries && navigations } class="gb-autocomplete__divider"></div>
      <div each={ navigations }>
        <h4 class="gb-navigation__title">{ displayName }</h4>
        <gb-list class="gb-autocomplete-items" items={ values } scope="gb-sayt">
          <gb-autocomplete-link send={ _scope.searchRefinement } data-value="{ displayName }: { item }"
              data-refinement={ item } data-field={ name }>
            <gb-raw content={ _scope.highlightCurrentQuery(item, '<b>$&</b>') }></gb-raw>
          </gb-autocomplete-link>
        </gb-list>
      </div>
    </ul>
    <ul if={ products } class="gb-sayt__products">
      <li each="{ products }">
        <gb-product></gb-product>
      </li>
    </ul>
  </div>

  <script>
    import '../raw/gb-raw.tag';
    import '../results/gb-product.tag';
    import './gb-autocomplete-link.tag';
    import { Sayt } from './gb-sayt';
    this.mixin(new Sayt().__proto__);
  </script>

  <style scoped>
    .gb-stylish.gb-sayt {
      display: flex;
    }

    .gb-stylish ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .gb-stylish .gb-category-query {
      font-weight: bold;
      color: darkorange;
    }

    .gb-stylish .gb-autocomplete__divider {
      margin: 3px 10%;
      border-top: 1px solid #777;
    }

    .gb-stylish .gb-sayt__autocomplete {
      min-width: 210px;
    }

    .gb-stylish .gb-autocomplete__link {
      padding: 5px 15px;
      text-decoration: none;
      display: block;
    }

    .gb-stylish .gb-autocomplete__item:hover,
    .gb-stylish .gb-autocomplete__item.active {
      background-color: #f1f1f1;
    }

    .gb-stylish .gb-navigation__title {
      margin: 4px;
    }

    .gb-stylish .gb-sayt__products {
      min-width: 300px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      width: calc(86px * 4);
      align-content: flex-start;
    }

    .gb-stylish .gb-sayt__products > * {
      margin: 3px;
    }

    .gb-stylish .gb-sayt__products .gb-product__image {
      vertical-align: bottom;
      width: 80px;
    }

    .gb-stylish .gb-sayt__products .gb-product__info-link {
      display: none;
    }

    .gb-stylish .gb-sayt__products .gb-product:hover {
      box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    }
  </style>
</gb-sayt>
