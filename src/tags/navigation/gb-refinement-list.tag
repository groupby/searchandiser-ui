<gb-refinement-list>
  <div class="gb-refinement-list { _style }">
    <h4 class="gb-navigation-title">{ nav.displayName }</h4>
    <ul>
      <gb-selected-refinement if={ showSelected } each={ ref in nav.selected }></gb-selected-refinement>
      <gb-available-refinement each={ ref in nav.available }></gb-available-refinement>
    </ul>
  </div>

  <style scoped>
    .gb-stylish.gb-refinement-list .gb-navigation-title {
      font-size: 18px;
      margin: 10px 0;
    }
    .gb-stylish.gb-refinement-list ul {
      margin: 0;
      padding-left: 8px;
    }
  </style>
</gb-refinement-list>
