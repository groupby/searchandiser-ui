<gb-raw-query>
  <script>
    require('./sayt/gb-sayt.tag');
    const { unless } = require('../utils');
    const ENTER_KEY = 13;
    const { getParam } = require('../utils');
    const { mount } = require('./sayt/query-wrapper');
    const autoSearch = unless(opts.autoSearch, true);
    const staticSearch = unless(opts.staticSearch, false);
    const saytEnabled = unless(opts.sayt, true);
    const queryParam = opts.queryParam || 'q';
    const searchUrl = `${unless(opts.searchUrl, 'search')}?${queryParam}=`;
    const queryFromUrl = getParam(queryParam);

    const inputValue = () => this.root.value;
    if (saytEnabled) mount(this, opts);
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
    opts.flux.on(opts.flux.REWRITE_QUERY, (query) => this.root.value = query);
    if (queryFromUrl) opts.flux.rewrite(queryFromUrl);
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
