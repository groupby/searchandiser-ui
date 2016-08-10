<gb-collections>
  <yield>
    <gb-list class="gb-collections { _style }" items={ collections } if={ !dropdown } inline>
      <gb-collection-item></gb-collection-item>
    </gb-list>
    <gb-select if={ dropdown }>
      <gb-custom-select>
        <gb-collection-dropdown-item></gb-collection-dropdown-item>
      </gb-custom-select>
    </gb-select>
  </yield>

  <script>
    import './gb-collection-item.tag';
    import './gb-collection-dropdown-item.tag';
    import '../badge/gb-badge.tag';
    import '../list/gb-list.tag';
    import '../select/gb-select.tag';
    import { Collections } from './gb-collections';
    this._mixin(Collections);
  </script>
</gb-collections>
