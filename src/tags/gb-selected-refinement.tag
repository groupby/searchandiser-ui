<gb-selected-refinement>
  <li>
    <a href="#" onclick={ remove }>×</a> <b>{ nav.displayName }: { ref.type === 'Value' ? ref.value : ref.low + ' .. ' + ref.high }</b>
  </li>

  <script>
    const utils = require('../utils');
    this.parentOpts = this.parent.parent.opts;
    this.remove = () => this.parentOpts.flux.unrefine(utils.toRefinement(this.ref, this.nav));
  </script>
</gb-selected-refinement>
