<gb-sayt-search-terms>
  <gb-list items={ _scope.queries }>
    <gb-sayt-link send={ _scope.search } data-value="{ item.value }">
        <gb-raw content={ _scope.highlightCurrentQuery(item.value, '<b>$&</b>') }></gb-raw>
    </gb-sayt-link>
  </gb-list>

  <script>
    import '../list/gb-list.tag';
    import './gb-sayt-link.tag';
    import '../raw/gb-raw.tag';

    this._scopeTo('gb-sayt');
  </script>
</gb-sayt-search-terms>
