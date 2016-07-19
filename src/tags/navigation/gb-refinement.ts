const { toRefinement, displayRefinement } = require('../../utils');

export class Refinement {

  parent: any;

  parentOpts: any;
  toView: Function;
  toRefinement: Function;

  init() {
    this.parentOpts = this.parent.parent.opts;
    this.toView = displayRefinement;
    this.toRefinement = toRefinement;
  }
};
