<gb-details>
  <div class="gb-details">
    <yield/>
  </div>

  <script>
    const idParam = opts.idParam || 'id';
    const queryParam = window.location.search
      .substring(1)
      .split('&')
      .find(value => value.startsWith(idParam));

    this.struct = opts.config.structure;
    opts.flux.on(opts.flux.DETAILS, (record) => this.update({ record }));
    if (queryParam && queryParam.includes('=')) opts.flux.details(queryParam.split('=')[1]);
  </script>
</gb-details>
