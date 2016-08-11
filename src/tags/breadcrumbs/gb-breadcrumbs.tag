<gb-breadcrumbs>
  <yield>
    <div class="gb-query-crumb" if={ !hideQuery && originalQuery }>{ originalQuery }</div>
    <gb-list class="gb-breadcrumbs { _style }" items={ selected } when={ !hideRefinements } scope="gb-breadcrumbs">
      <gb-list class="gb-navigation-crumb" items={ item.refinements } scope="gb-breadcrumbs">
        <gb-refinement-crumb navigation={ parent.item }></gb-refinement-crumb>
      </gb-list>
    </gb-list>
  </yield>

  <script>
    import '../list/gb-list.tag';
    import './gb-refinement-crumb.tag';
    import { Breadcrumbs } from './gb-breadcrumbs';
    this.mixin(new Breadcrumbs().__proto__);
  </script>

  <style scoped>
    .gb-stylish.gb-breadcrumbs {
      display: flex;
      margin: 0;
      padding: 0;
      list-style: none;
      justify-content: flex-start;
    }
  </style>
</gb-breadcrumbs>
