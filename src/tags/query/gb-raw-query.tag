<gb-raw-query>
  <script>
    require('../sayt/gb-sayt.tag');
    const { Query } = require('./gb-query');
    this.mixin(new Query());
  </script>

  <style>
    .gb-query-wrapper {
      position: relative;
      display: inline-block;
    }
    .gb-sayt-target {
      z-index: 10;
      position: absolute;
      min-width: 175px;
      background-color: #fff;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    }
  </style>
</gb-raw-query>
