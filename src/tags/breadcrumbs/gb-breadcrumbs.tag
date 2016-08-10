<gb-breadcrumbs>
  <yield>
    <div class="gb-breadcrumbs { _style }">
      <div class="gb-query-crumb" if={ !hideQuery && originalQuery }>{ originalQuery }</div>
      <gb-list items={ selected } if={ !hideRefinements }>
        <gb-list class="gb-navigation-crumb" items={ item.refinements } inline>
          <gb-refinement-crumb nav={ parent.item } ref={ item }></gb-refinement-crumb>
        </gb-list>
      </gb-list>
    </div>
  </yield>

  <script>
    import '../list/gb-list.tag';
    import './gb-refinement-crumb.tag';
    import { Breadcrumbs } from './gb-breadcrumbs';
    this._mixin(Breadcrumbs);
  </script>

  <style scoped>
    .gb-stylish.gb-breadcrumbs {
      display: flex;
      justify-content: flex-start;
      align-items: baseline;
    }
  </style>
</gb-breadcrumbs>
