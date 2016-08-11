import { FluxCapacitor, Events } from 'groupby-api';
import { fluxTag } from '../utils/tags';
import { RefinementCrumb } from '../../src/tags/breadcrumbs/gb-refinement-crumb';
import { expect } from 'chai';

describe('gb-refinement-crumb logic', () => {
  let tag: RefinementCrumb,
    flux: FluxCapacitor;

  beforeEach(() => ({ tag, flux } = fluxTag(new RefinementCrumb())));

  it('should have inherited values', () => {
    const parentOpts = { a: 'b', c: 'd' };
    setParentOpts(parentOpts);

    tag.init();

    expect(tag.parentOpts).to.eql(parentOpts);
    expect(tag.toView).to.be.a('function');
  });

  it('should be able to remove itself', (done) => {
    flux.unrefine = (refinement): any => {
      expect(refinement).to.eql({ type: 'Value', value: 'test', navigationName: 'Brand' });
      done();
    };
    setParentOpts({ flux });

    tag.ref = { type: 'Value', value: 'test' };
    tag.nav = { name: 'Brand' };
    tag.init();

    tag.remove();
  });

  function setParentOpts(opts: any) {
    tag.parent = <Riot.Tag.Instance & any>{
      parent: { opts }
    };
  }
});
