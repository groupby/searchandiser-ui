<gb-related-queries>
  <yield>
    <gb-list class="gb-related-queries { _style }" items={ relatedQueries }>
      <a onclick={ _scope.send }>{ item }</a>
    </gb-list>
  </yield>

  <script>
    import '../list/gb-list.tag';
    import { RelatedQueries } from './gb-related-queries';
    this.mixin(new RelatedQueries().__proto__);
  </script>
</gb-related-queries>
