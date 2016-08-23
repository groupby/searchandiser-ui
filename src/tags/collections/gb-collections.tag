<gb-collections>
  <yield>
    <gb-list class="gb-collections { _style }" items={ collections }>
      <gb-collection-item></gb-collection-item>
    </gb-list>
  </yield>

  <script>
    import './gb-collection-item.tag';
    import '../list/gb-list.tag';
    import { Collections } from './gb-collections';
    this._mixin(Collections);
  </script>
</gb-collections>
