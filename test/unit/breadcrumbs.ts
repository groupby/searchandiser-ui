import { FluxCapacitor, Events } from 'groupby-api';
import { Breadcrumbs } from '../../src/tags/breadcrumbs/gb-breadcrumbs';
import { expect } from 'chai';

describe('gb-breadcrumbs logic', () => {
  let breadcrumbs: Breadcrumbs,
    flux: FluxCapacitor;

  beforeEach(() => breadcrumbs = Object.assign(new Breadcrumbs(), {
    flux: flux = new FluxCapacitor(''),
    opts: {}
  }));

  it('should have default values', () => {
    breadcrumbs.init();

    expect(breadcrumbs.hideQuery).to.be.false;
    expect(breadcrumbs.hideRefinements).to.be.false;
  });

  it('should allow override from opts', () => {
    Object.assign(breadcrumbs.opts, { hideQuery: true, hideRefinements: true });
    breadcrumbs.init();

    expect(breadcrumbs.hideQuery).to.be.true;
    expect(breadcrumbs.hideRefinements).to.be.true;
  });

  it('should listen for events', () => {
    flux.on = (event: string): any => expect(event).to.be.oneOf([
      Events.REFINEMENTS_CHANGED,
      Events.RESULTS,
      Events.RESET
    ]);

    breadcrumbs.init();
  });

  it('should update selected on REFINEMENTS_CHANGED', (done) => {
    const selected = ['a', 'b', 'c'];

    let callback;
    flux.on = (event: string, cb: Function): any => {
      if (event === Events.REFINEMENTS_CHANGED) callback = cb;
    };

    breadcrumbs.update = (obj: any) => {
      expect(obj.selected).to.eql(selected);
      done();
    };
    breadcrumbs.init();

    callback({ selected });
  });

  it('should empty selected on RESET', (done) => {
    let callback;
    flux.on = (event: string, cb: Function): any => {
      if (event === Events.RESET) callback = cb;
    };

    breadcrumbs.update = (obj: any) => {
      expect(obj.selected.length).to.eq(0);
      done();
    };
    breadcrumbs.init();

    callback();
  });

  it('should update originalQuery on RESULTS', (done) => {
    const originalQuery = 'red sneakers';

    let callback;
    flux.on = (event: string, cb: Function): any => {
      if (event === Events.RESULTS) callback = cb;
    };

    breadcrumbs.update = (obj: any) => {
      expect(obj.originalQuery).to.eq(originalQuery);
      done();
    };
    breadcrumbs.init();

    callback({ originalQuery });
  });
});
