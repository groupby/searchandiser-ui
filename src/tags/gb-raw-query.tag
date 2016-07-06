<gb-raw-query>
  <script>
    require('./sayt/gb-sayt.tag');
    const ENTER_KEY = 13;
    const queryWrapper = require('./sayt/query-wrapper');
    const autoSearch = opts.autoSearch === undefined ? true : opts.autoSearch;
    const staticSearch = opts.staticSearch === undefined ? false : opts.staticSearch;
    const saytEnabled = opts.sayt === undefined ? true : opts.sayt;
    const queryParam = opts.queryParam === undefined ? 'q' : opts.queryParam;
    const searchUrl = `${opts.searchUrl === undefined ? 'search' : opts.searchUrl}?${queryParam}=`;

    const inputValue = () => this.root.value;
    if (saytEnabled) queryWrapper.mount(this, opts);
    if (autoSearch)  {
      this.on('before-mount', () => this.root.addEventListener('input', () => opts.flux.reset(inputValue())));
    } else if (staticSearch) {
      this.on('before-mount', () => this.root.addEventListener('keydown', (event) => {
        switch(event.keyCode) {
          case ENTER_KEY: return window.location.replace(`${searchUrl}${inputValue()}`);
        }
      }));
    } else {
      this.on('before-mount', () => this.root.addEventListener('keydown', (event) => {
        switch(event.keyCode) {
          case ENTER_KEY: return opts.flux.reset(inputValue());
        }
      }));
    }
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
