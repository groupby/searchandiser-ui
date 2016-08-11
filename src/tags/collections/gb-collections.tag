<gb-collections>
  <yield>
    <gb-list class="gb-collections { _style }" items={ collections } inline>
      <gb-collection-item item={ item }></gb-collection-item>
    </gb-list>
  </yield>

  <script>
    import './gb-collection-item.tag';
    import '../list/gb-list.tag';
    import { Collections } from './gb-collections';
    this.mixin(new Collections().__proto__);
  </script>
</gb-collections>
