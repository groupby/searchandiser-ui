<gb-collections>
  <yield>
    <gb-list class="gb-collections { _style }" items={ collections } scope="gb-collections">
      <a class="gb-collection" onclick={ _scope.switchCollection } data-collection={ item }>
        <span class="gb-collection__name">{ _scope.labels[item] || item }</span>
        <span if={ _scope.fetchCounts } class="gb-collection__count">{ _scope.counts[item] }</span>
      </a>
    </gb-list>
  </yield>

  <script>
    import '../list/gb-list.tag';
    import { Collections } from './gb-collections';
    this.mixin(new Collections().__proto__);
  </script>
</gb-collections>
