<gb-raw-query>
  <script>
    const sayt = require('sayt');
    const config = opts.config;

    this.on('before-mount', () => {
      this.root.oninput = () => {
        opts.flux.reset(this.root.value);
        // sayt.autocomplete(this.root.value)
        //   .then(console.log)
        //   .catch(console.error);
      };
      // sayt.configure({
      //   subdomain: config.customerId,
      //   collection: config.collection,
      //   productSearch: { area: config.area }
      // });
    });
    opts.flux.on(opts.flux.REWRITE_QUERY, query => this.root.value = query);
  </script>
</gb-raw-query>
