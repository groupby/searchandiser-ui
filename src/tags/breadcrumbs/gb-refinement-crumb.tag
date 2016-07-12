<gb-refinement-crumb>
  <li class="gb-refinement-crumb { parentOpts.style() }">
    <a onclick={ remove }>&times;</a> <b>{ nav.displayName }: { ref.type === 'Value' ? ref.value : ref.low + ' - ' + ref.high }</b>
  </li>

  <script>
    const utils = require('../../utils');
    this.parentOpts = this.parent.parent.opts;
    this.remove = () => this.parentOpts.flux.unrefine(utils.toRefinement(this.ref, this.nav));
  </script>

  <style>
    .gb-stylish.gb-refinement-crumb {
      display: flex;
    }

    .gb-stylish.gb-refinement-crumb a {
      cursor: pointer;
    }
  </style>
</gb-refinement-crumb>
