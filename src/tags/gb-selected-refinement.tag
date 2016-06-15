<gb-selected-refinement>
  <li>
    <a href="#" onclick={ remove }>x</a> <b>{ opts.nav.displayName }: { ref.type === 'Value' ? ref.value : ref.low + ' .. ' + ref.high }</b>
  </li>

  <script>
    this.remove = () => opts.flux.unrefine(this.generateSelectedRefinement())
        .then(() => opts.srch.trigger());

    this.generateSelectedRefinement = () => {
      const refinement = Object.assign({}, opts.ref, { navigationName: opts.nav.name });
      delete refinement['count'];
      return refinement;
    };
  </script>
</gb-selected-refinement>
