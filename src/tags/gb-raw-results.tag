<gb-raw-results>
  <div each="{ records }">
    <yield/>
  </div>

  <script>
    this.struct = opts.config.structure;

    opts.flux.on(opts.flux.RESULTS, res => this.update({ records: res.records }));
  </script>
</gb-raw-results>
