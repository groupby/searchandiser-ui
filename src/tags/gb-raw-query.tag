<gb-raw-query>
  <script>
    this.on('before-mount', () => this.root.oninput = () => opts.flux.reset(this.root.value));
    opts.flux.on(opts.flux.REWRITE_QUERY, query => this.root.value = query);
  </script>
</gb-raw-query>
