<gb-sayt>
  <div class="{ _style }" if={ queries.length || navigations.length }>
    <gb-sayt-autocomplete></gb-sayt-autocomplete>
    <gb-sayt-products if={ showProducts }></gb-sayt-products>
  </div>

  <script>
    import './gb-sayt-autocomplete.tag';
    import './gb-sayt-products.tag';
    import { Sayt } from './gb-sayt';
    import { SaytTag } from '../tag';
    this._mixin(SaytTag, Sayt);    
  </script>

  <style scoped>
    div.gb-stylish {
      display: flex;
    }

    .gb-stylish ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .gb-stylish gb-sayt-link:hover,
    .gb-stylish gb-sayt-link.active {
      background-color: #f1f1f1;
      display: block;
    }

    .gb-stylish gb-list li {
      margin: 0px;
    }
  </style>
</gb-sayt>
