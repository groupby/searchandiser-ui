<gb-selected-refinement>
  <li>
    <a href="#" onclick={ remove }>x</a> <b>{ opts.nav.displayName }: { ref.type === 'Value' ? ref.value : ref.low + ' .. ' + ref.high }</b>
  </li>

  <script>
    this.remove = () => {
      opts.srch.state.refinements.splice(opts.srch.state.refinements.findIndex(this.matchesRefinement), 1);
      // opts.srch.search(new Query(opts.srch.query.build().query).withSelectedRefinements(opts.srch.state.refinements));
      // console.dir(opts.srch.state.refinements);
    };

    this.matchesRefinement = (ref) => ref.type === 'Value' ?
      ref.value === opts.ref.value :
      (ref.low === opts.ref.low && ref.high === opts.ref.high);
  </script>
</gb-selected-refinement>
