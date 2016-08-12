<gb-raw-query>
  <script>
    import { Query } from './gb-query';
    this.mixin(new Query().__proto__);
  </script>

  <style>
    .gb-query-wrapper {
      position: relative;
    }
    .gb-sayt-target {
      top: 31px;
      left: 0;
      z-index: 10;
      position: absolute;
      min-width: 175px;
      background-color: #fff;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    }
  </style>
</gb-raw-query>
