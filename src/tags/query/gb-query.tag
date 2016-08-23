<gb-query>
  <yield>
    <div class="gb-query { _style }">
      <gb-search-box></gb-search-box>
      <gb-submit></gb-submit>
      <gb-reset></gb-reset>
      <gb-sayt if={ saytEnabled }></gb-sayt>
    </div>
  </yield>

  <script>
    import './gb-search-box.tag';
    import '../submit/gb-submit.tag';
    import '../reset/gb-reset.tag';
    import '../sayt/gb-sayt.tag';
    import { Query } from './gb-query';
    this._mixin(Query);
  </script>

  <style scoped>
    .gb-stylish.gb-query {
      position: relative;
      display: flex;
      align-items: baseline;
    }
    .gb-stylish.gb-query gb-sayt {
      top: 31px;
      left: 0;
      z-index: 10;
      position: absolute;
      min-width: 175px;
      background-color: #fff;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    }
  </style>
</gb-query>
