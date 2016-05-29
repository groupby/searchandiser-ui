<gb-available-refinement>
  <li>
    <a href="#" onclick={ send }>{ ref.type === 'Value' ? ref.value : ref.low + ' - ' + ref.high } ({ ref.count })</a>
  </li>

  <script>
    this.send = () => {
      const selectedRefinement = this.generateSelectedRefinement();
      opts.srch.search(opts.srch.query.withSelectedRefinements(selectedRefinement));
      opts.srch.state.refinements.push(selectedRefinement);
    };

    this.generateSelectedRefinement = () => new Object({
      navigationName: opts.nav.name,
      type: opts.ref.type,
      value: opts.ref.value,
      low: opts.ref.low,
      high: opts.ref.high
    });
  </script>
</gb-available-refinement>
