<gb-sayt-categories>
  <gb-list items={ categoryResults }>
    <gb-sayt-link send={ _scope.searchCategory } data-value={ item.value }
        data-refinement={ item.category } data-field={ _scope.categoryField }>
      <gb-raw content={ _scope.highlightCurrentQuery(item.value, '<b>$&</b>') }></gb-raw>
      in
      <span class="gb-category-query">{ item.category }</span>
    </gb-sayt-link>
  </gb-list>

  <script>
    import '../list/gb-list.tag';
    import './gb-sayt-link.tag';
    import '../raw/gb-raw.tag';

    this._scopeTo('gb-sayt');
  </script>

  <style scoped>
    .gb-stylish :scope .gb-category-query {
      font-weight: bold;
      color: darkorange;
    }
  </style>
</gb-sayt-categories>
