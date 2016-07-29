<gb-raw-submit>
  <yield/>

  <script>
    import {unless, updateLocation} from '../utils';

    const label        = opts.label || 'Search';
    const staticSearch = unless(this.opts.staticSearch, false);
    const queryParam   = this.opts.queryParam || 'q';
    const searchUrl    = `${this.opts.searchUrl || 'search'}`;

    if (this.root.tagName === 'INPUT') this.root.value = label;

    this.root.addEventListener('click', () => {
      const inputValue = document.querySelector('[riot-tag="gb-raw-query"]').value;

      if (staticSearch && window.location.pathname !== searchUrl) {
        updateLocation(searchUrl, queryParam, inputValue, []);
      } else {
        this.opts.flux.reset(inputValue);
      }
    });
  </script>
</gb-raw-submit>
