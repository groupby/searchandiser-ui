import { FluxCapacitor, Events, Results } from 'groupby-api';
import { Filter } from '../../src/tags/filter/gb-filter';
import { expect } from 'chai';

describe('gb-filter logic', () => {
  let filter: Filter;
  let flux: FluxCapacitor,
    fluxClone: FluxCapacitor;
  beforeEach(() => {
    filter = new Filter();
    flux = new FluxCapacitor('');
    fluxClone = new FluxCapacitor('');
    filter.opts = { flux, clone: () => fluxClone };
  });

  it('should have default values', () => {
    filter.init();
    expect(filter.parentOpts).to.have.all.keys('flux', 'clone');
    expect(filter.navField).to.not.be.ok;
    expect(filter.passthrough).to.be.ok;
    expect(filter.passthrough.hover).to.not.be.ok;
    expect(filter.passthrough.update).to.eq(filter.navigate);
    expect(filter.passthrough.label).to.eq('Filter');
    expect(filter.passthrough.clear).to.eq('Unfiltered');
  });

  it('should allow override from opts', () => {
    const label = 'Select Brand';
    const clear = 'All Brands';
    const field = 'Brand';
    const onHover = false;

    Object.assign(filter.opts, { label, clear, field, onHover });
    filter.init();

    expect(filter.parentOpts).to.have.all.keys('flux', 'clone', 'label', 'clear', 'field', 'onHover');
    expect(filter.navField).to.eq(field);
    expect(filter.passthrough).to.be.ok;
    expect(filter.passthrough.hover).to.eq(onHover);
    expect(filter.passthrough.label).to.eq(label);
    expect(filter.passthrough.clear).to.eq(clear);
  });

  it('should listen for events', () => {
    flux.on = (event: string): any => expect(event).to.eq(Events.RESULTS);

    filter.init();
  });

  it('should call updateFluxClone on RESULTS', (done) => {
    let callback;
    flux.on = (event: string, cb: Function): any => callback = cb;

    filter.updateFluxClone = () => done();
    filter.init();

    callback();
  });

  it('should update fluxClone state', () => {
    const parentQuery = 'red sneakers';

    fluxClone.search = (query: string): any => {
      expect(query).to.eq(parentQuery);
      return { then: (cb: Function) => expect(cb).to.eq(filter.updateValues) };
    };

    filter.init();

    flux.query.withQuery(parentQuery);
    filter.updateFluxClone();
    expect(fluxClone.query.raw.refinements.length).to.eq(0);
  });

  it('should update fluxClone state with refinements', () => {
    const parentQuery = 'red sneakers';
    const refinements: any = { a: 'b', c: 'd' };

    fluxClone.search = (query: string): any => {
      expect(query).to.eq(parentQuery);
      return { then: (cb: Function) => expect(cb).to.eq(filter.updateValues) };
    };

    filter.init();
    filter.isTargetNav = () => false;

    flux.query.withQuery(parentQuery).withSelectedRefinements(refinements);
    filter.updateFluxClone();
    expect(fluxClone.query.raw.refinements).to.eql([refinements]);
  });

  it('should find the configured navigation', () => {
    const targetField = 'brand';

    filter.init();
    filter.navField = targetField;

    expect(filter.isTargetNav(targetField)).to.be.true;
  });

  it('should convert refinements if found', () => {
    const refinement = { value: 'a', other: 'b' };

    filter.init();
    filter.isTargetNav = () => true;

    const converted = filter.convertRefinements([{ refinements: [refinement] }]);
    expect(converted).to.eql([{ label: refinement.value, value: refinement }])
  });

  it('should return an empty list if not found', () => {
    filter.init();
    filter.isTargetNav = () => false;

    const converted = filter.convertRefinements([{ refinements: [{ a: 'b' }] }]);
    expect(converted.length).to.eq(0)
  });

  it('should update the select tag with options', () => {
    const refinements = [{ a: 'b', c: 'd' }];

    filter.init();
    filter.selectElement = {
      _tag: <Filter & any>{ update: ({ options }) => expect(options).to.eq(refinements) }
    };
    filter.convertRefinements = () => refinements;

    filter.updateValues(<Results>{});
  });

  it('should call reset on clear navigation', (done) => {
    flux.reset = () => done();

    filter.init();

    filter.navigate('*');
  });

  it('should call refine on navigation selected', (done) => {
    const selection = { type: 'Value', value: 'DeWalt' };
    const navigationName = 'brand';

    flux.refine = (selected): any => {
      expect(selected).to.eql(Object.assign(selection, { navigationName }));
      done();
    };

    filter.init();
    filter.navField = navigationName;

    filter.navigate(selection);
  });

  it('should call unrefine to clear current selection', (done) => {
    const selection = { a: 'b', c: 'd' };

    flux.unrefine = (selected, opts): any => {
      expect(selected).to.eq(selection);
      expect(opts.skipSearch).to.be.true;
      done();
    };

    filter.init();
    filter.selected = selection;

    filter.navigate('*');
  });
});
