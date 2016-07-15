<gb-breadcrumbs>
  <ul class="gb-breadcrumbs { opts.style() }">
    <li if={ !hideQuery && originalQuery }>{ originalQuery }</li>
    <li if={ !hideRefinements } each={ nav in selected }>
      <ul class="gb-nav-crumb">
        <gb-refinement-crumb each={ ref in nav.refinements }></gb-refinement-crumb>
      </ul>
    </li>
  </ul>

  <script>
    require('./gb-refinement-crumb.tag');
    const { Breadcrumbs } = require('./gb-breadcrumbs');
    this.mixin(new Breadcrumbs());
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
