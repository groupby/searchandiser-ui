<gb-related-searches>
  <ul class="gb-related-searches { _style }">
    <li class="gb-related-search" each={ related in relatedQueries }>
      <a class="gb-related-search__link" onclick={ send }>{ related }</a>
    </li>
  </ul>

  <script>
    import { RelatedSearches } from './gb-related-searches';
    this.mixin(new RelatedSearches().__proto__);
  </script>

  <style scoped>
    .gb-stylish.gb-related-searches a {
      cursor: pointer;
    }
  </style>
</gb-related-searches>
