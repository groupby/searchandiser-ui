<gb-raw-query>
  <script>
    require('./sayt/gb-sayt.tag');
    const queryWrapper = require('./sayt/query-wrapper');
    const saytEnabled = opts.sayt === undefined ? true : opts.sayt;

    if (saytEnabled) queryWrapper.mount(this, opts);
    this.on('before-mount', () => this.root.addEventListener('input', () => opts.flux.reset(this.root.value)));
    opts.flux.on(opts.flux.REWRITE_QUERY, query => this.root.value = query);
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
