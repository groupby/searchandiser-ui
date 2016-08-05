import { FluxCapacitor, Events } from 'groupby-api';
import { RefinementCrumb } from '../../src/tags/breadcrumbs/gb-refinement-crumb';
import { expect } from 'chai';

describe('gb-refinement-crumb logic', () => {
  let refinementCrumb: RefinementCrumb,
    flux: FluxCapacitor;

  beforeEach(() => refinementCrumb = Object.assign(new RefinementCrumb(), {
    flux: flux = new FluxCapacitor(''),
    opts: {}
  }));

  it('should have inherited values', () => {
    const parentOpts = { a: 'b', c: 'd' };
    setParentOpts(parentOpts);

    refinementCrumb.init();

    expect(refinementCrumb.parentOpts).to.eql(parentOpts);
    expect(refinementCrumb.toView).to.be.a('function');
  });

  it('should be able to remove itself', (done) => {
    flux.unrefine = (refinement): any => {
      expect(refinement).to.eql({ type: 'Value', value: 'test', navigationName: 'Brand' });
      done();
    };
    setParentOpts({ flux });

    refinementCrumb.ref = { type: 'Value', value: 'test' };
    refinementCrumb.nav = { name: 'Brand' };
    refinementCrumb.init();

    refinementCrumb.remove();
  });

  function setParentOpts(opts: any) {
    refinementCrumb.parent = <Riot.Tag.Instance & any>{
      parent: { opts }
    };
  }
});
