const { toRefinement, displayRefinement } = require('../../utils');

export function Refinement() {
  this.init = function() {
    this.parentOpts = this.parent.parent.opts;
  };

  this.toView = displayRefinement;
  this.toRefinement = toRefinement;
}
