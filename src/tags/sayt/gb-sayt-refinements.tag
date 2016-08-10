<gb-sayt-refinements>
  <h4>{ displayName }</h4>
  <gb-list items={ values }>
    <gb-sayt-link send={ _scope.searchRefinement } data-value="{ displayName }: { item }"
        data-refinement={ item } data-field={ name }>
      <gb-raw content={ _scope.highlightCurrentQuery(item, '<b>$&</b>') }></gb-raw>
    </gb-sayt-link>
  </gb-list>

  <script>
    import '../list/gb-list.tag';
    import './gb-sayt-link.tag';
    import '../raw/gb-raw.tag';

    this._scopeTo('gb-sayt');
  </script>

  <style scoped>
    .gb-stylish :scope h4 {
      margin: 4px;
    }
  </style>
</gb-sayt-refinements>
