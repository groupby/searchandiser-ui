<gb-breadcrumbs>
  <ul class="gb-breadcrumbs { opts.style() }">
    <li class="gb-breadcrumbs__query" if={ !hideQuery && originalQuery }>{ originalQuery }</li>
    <li class="gb-breadcrumbs__refinements" if={ !hideRefinements } each={ nav in selected }>
      <ul class="gb-nav-crumb">
        <gb-refinement-crumb each={ ref in nav.refinements }></gb-refinement-crumb>
      </ul>
    </li>
  </ul>

  <script>
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
