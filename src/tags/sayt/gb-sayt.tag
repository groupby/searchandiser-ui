<gb-sayt>
  <div class="gb-sayt { _style }" if={ queries || navigations }>
    <ul class="gb-sayt__autocomplete" name="autocompleteList">
      <li class="gb-autocomplete__item" each={ query in categoryResults } data-value={ query.value } data-refinement={
          query.category } data-field={ categoryField }>
        <a class="gb-autocomplete__link" href="#" onclick={ searchCategory }>
          <gb-raw content={ enhanceCategoryQuery(query) }></gb-raw>
        </a>
      </li>
      <div if={ queries && categoryResults.length } class="gb-autocomplete__divider"></div>
      <li class="gb-autocomplete__item" each={ queries } data-value={ value }>
        <a class="gb-autocomplete__link" href="#" onclick={ search }>
          <gb-raw content={ enhanceQuery(value) }></gb-raw>
        </a>
      </li>
      <div if={ queries && navigations } class="gb-autocomplete__divider"></div>
      <div each={ navigations }>
        <h4 class="gb-navigation__title">{ displayName }</h4>
        <li class="gb-autocomplete__item" each={ value in values } data-value="{ displayName }: { value }"
            data-refinement={ value } data-field={ name }>
          <a class="gb-autocomplete__link" href="#" onclick={ searchRefinement }>
            <gb-raw content="{ enhanceQuery(value) }"></gb-raw>
          </a>
        </li>
      </div>
    </ul>
    <gb-sayt-products></gb-sayt-products>
  </div>

  <script>
    import '../raw/gb-raw.tag';
    import './gb-sayt-products.tag';
    import { Sayt } from './gb-sayt';
    this._mixin(Sayt);
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

    .gb-stylish gb-sayt-products {
      min-width: 300px;
    }
  </style>
</gb-sayt>
