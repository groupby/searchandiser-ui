<gb-selected-refinement>
  <li>
    <a href="#" onclick={ remove }>x</a> <b>{ parent.nav.displayName }: { ref.type === 'Value' ? ref.value : ref.low + ' .. ' + ref.high }</b>
  </li>

  <script>
    const utils = require('../utils');
    this.remove = () => this.parent.flux.unrefine(utils.toRefinement(opts.ref, this.parent.nav));
  </script>
</gb-selected-refinement>
