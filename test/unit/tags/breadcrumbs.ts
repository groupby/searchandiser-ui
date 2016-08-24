import { FluxCapacitor, Events } from 'groupby-api';
import { fluxTag } from '../../utils/tags';
import { Breadcrumbs } from '../../../src/tags/breadcrumbs/gb-breadcrumbs';
import { expect } from 'chai';

describe('gb-breadcrumbs logic', () => {
  let tag: Breadcrumbs,
    flux: FluxCapacitor;

  beforeEach(() => ({ tag, flux } = fluxTag(new Breadcrumbs())));

  it('should have default values', () => {
    tag.init();

    expect(tag.hideQuery).to.be.false;
    expect(tag.hideRefinements).to.be.false;
  });

  it('should allow override from opts', () => {
    Object.assign(tag.opts, { hideQuery: true, hideRefinements: true });
    tag.init();

    expect(tag.hideQuery).to.be.true;
    expect(tag.hideRefinements).to.be.true;
  });

  it('should listen for events', () => {
    flux.on = (event: string): any => expect(event).to.be.oneOf([
      Events.REFINEMENTS_CHANGED,
      Events.RESULTS,
      Events.RESET
    ]);

    tag.init();
  });

  it('should update selected on REFINEMENTS_CHANGED', (done) => {
    const selected = ['a', 'b', 'c'];

    let callback;
    flux.on = (event: string, cb: Function): any => {
      if (event === Events.REFINEMENTS_CHANGED) callback = cb;
    };

    tag.update = (obj: any) => {
      expect(obj.selected).to.eql(selected);
      done();
    };
    tag.init();

    callback({ selected });
  });

  it('should empty selected on RESET', (done) => {
    let callback;
    flux.on = (event: string, cb: Function): any => {
      if (event === Events.RESET) callback = cb;
    };

    tag.update = (obj: any) => {
      expect(obj.selected.length).to.eq(0);
      done();
    };
    tag.init();

    callback();
  });

  it('should update originalQuery on RESULTS', (done) => {
    const originalQuery = 'red sneakers';

    let callback;
    flux.on = (event: string, cb: Function): any => {
      if (event === Events.RESULTS) callback = cb;
    };

    tag.update = (obj: any) => {
      expect(obj.originalQuery).to.eq(originalQuery);
      done();
    };
    tag.init();

    callback({ originalQuery });
  });
});
