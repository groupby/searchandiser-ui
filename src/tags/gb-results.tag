<gb-results>
  <div each="{ records }">
    <a href="#">
      <img src="{ allMeta[struct.image] }" alt="" />
    </a>
    <a href="#">
      <p>{ allMeta[struct.title] }</p>
      <p>{ allMeta[struct.price] }</p>
    </a>
  </div>

  <script>
    this.struct = opts.config.structure;

    opts.flux.on(opts.flux.RESULTS, () => this.update({ records: opts.flux.results.records }));
  </script>
</gb-results>
