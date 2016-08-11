<gb-related-searches>
  <yield>
    <gb-list class="gb-related-searches { _style }" items={ relatedQueries }>
      <a onclick={ _scope.send }>{ item }</a>
    </gb-list>
  </yield>

  <script>
    import '../list/gb-list.tag';
    import { RelatedSearches } from './gb-related-searches';
    this.mixin(new RelatedSearches().__proto__);
  </script>
</gb-related-searches>
