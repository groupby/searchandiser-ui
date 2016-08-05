<gb-query>
  <div class="gb-query { _style }">
    <input riot-tag="gb-raw-query" passthrough={ opts } class="gb-query__box" type="text" placeholder="Search..." autofocus>
    <gb-submit></gb-submit>
    <gb-reset></gb-reset>
  </div>

  <script>
    import './gb-raw-query.tag';
    import '../submit/gb-submit.tag';
    import '../reset/gb-reset.tag';
  </script>

  <style scoped>
    .gb-stylish.gb-query {
      display: flex;
      align-items: baseline;
    }
    .gb-stylish .gb-query__box {
      padding: 6px 12px;
      font-size: 14px;
    }
  </style>
</gb-query>
