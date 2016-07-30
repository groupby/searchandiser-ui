<gb-query>
  <div class="gb-query { opts.style() }">
    <input class="gb-query__box" type="text" placeholder="Search..." autofocus>
    <gb-submit flux={ opts.flux } stylish={ opts.style }></gb-submit>
    <gb-reset flux={ opts.flux } stylish={ opts.style }></gb-reset>
  </div>

  <script>
    import '../submit/gb-submit.tag';
    import '../reset/gb-reset.tag';
    this.on('mount', () => riot.mount('.gb-query__box', 'gb-raw-query', opts));
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
