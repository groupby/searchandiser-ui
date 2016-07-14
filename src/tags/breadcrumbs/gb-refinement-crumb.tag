<gb-refinement-crumb>
  <li class="gb-refinement-crumb { parentOpts.style() }">
    <a onclick={ remove }>&times;</a> <b>{ nav.displayName }: { toView(ref) }</b>
  </li>

  <script>
    const { toRefinement, displayRefinement } = require('../../utils');
    this.toView = displayRefinement;
    this.parentOpts = this.parent.parent.opts;
    this.remove = () => this.parentOpts.flux.unrefine(toRefinement(this.ref, this.nav));
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
