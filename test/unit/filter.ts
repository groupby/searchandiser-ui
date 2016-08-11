import { FluxCapacitor, Events, Results } from 'groupby-api';
import { fluxTag } from '../utils/tags';
import { Filter } from '../../src/tags/filter/gb-filter';
import { expect } from 'chai';

describe('gb-filter logic', () => {
  let tag: Filter,
    flux: FluxCapacitor,
    fluxClone: FluxCapacitor;

  beforeEach(() => tag = Object.assign(new Filter(), {
    flux: flux = new FluxCapacitor(''),
    _clone: () => fluxClone = new FluxCapacitor(''),
    opts: {}
  }));

  it('should have default values', () => {
    tag.init();

    expect(tag.navField).to.not.be.ok;
    expect(tag.passthrough).to.be.ok;
    expect(tag.passthrough.hover).to.not.be.ok;
    expect(tag.passthrough.update).to.eq(tag.navigate);
    expect(tag.passthrough.label).to.eq('Filter');
    expect(tag.passthrough.clear).to.eq('Unfiltered');
  });

  it('should allow override from opts', () => {
    const label = 'Select Brand',
      clear = 'All Brands',
      field = 'Brand',
      onHover = false;

    Object.assign(tag.opts, { label, clear, field, onHover });
    tag.init();

    expect(tag.parentOpts).to.have.all.keys('label', 'clear', 'field', 'onHover');
    expect(tag.navField).to.eq(field);
    expect(tag.passthrough).to.be.ok;
    expect(tag.passthrough.hover).to.eq(onHover);
    expect(tag.passthrough.label).to.eq(label);
    expect(tag.passthrough.clear).to.eq(clear);
  });

  it('should listen for events', () => {
    flux.on = (event: string): any => expect(event).to.eq(Events.RESULTS);

    tag.init();
  });

  it('should call updateFluxClone on RESULTS', (done) => {
    let callback;
    flux.on = (event: string, cb: Function): any => callback = cb;

    tag.updateFluxClone = () => done();
    tag.init();

    callback();
  });

  it('should update fluxClone state', () => {
    const parentQuery = 'red sneakers';

    fluxClone.search = (query: string): any => {
      expect(query).to.eq(parentQuery);
      return { then: (cb: Function) => expect(cb).to.eq(tag.updateValues) };
    };

    tag.init();

    flux.query.withQuery(parentQuery);
    tag.updateFluxClone();
    expect(fluxClone.query.raw.refinements.length).to.eq(0);
  });

  it('should update fluxClone state with refinements', () => {
    const parentQuery = 'red sneakers',
      refinements: any = { a: 'b', c: 'd' };

    fluxClone.search = (query: string): any => {
      expect(query).to.eq(parentQuery);
      return { then: (cb: Function) => expect(cb).to.eq(tag.updateValues) };
    };

    tag.init();
    tag.isTargetNav = () => false;

    flux.query.withQuery(parentQuery).withSelectedRefinements(refinements);
    tag.updateFluxClone();
    expect(fluxClone.query.raw.refinements).to.eql([refinements]);
  });

  it('should find the configured navigation', () => {
    const targetField = 'brand';

    tag.init();
    tag.navField = targetField;

    expect(tag.isTargetNav(targetField)).to.be.true;
  });

  it('should convert refinements if found', () => {
    const refinement = { value: 'a', other: 'b' };

    tag.init();
    tag.isTargetNav = () => true;

    const converted = tag.convertRefinements([{ refinements: [refinement] }]);
    expect(converted).to.eql([{ label: refinement.value, value: refinement }])
  });

  it('should return an empty list if not found', () => {
    tag.init();
    tag.isTargetNav = () => false;

    const converted = tag.convertRefinements([{ refinements: [{ a: 'b' }] }]);
    expect(converted.length).to.eq(0)
  });

  it('should update the select tag with options', () => {
    const refinements = [{ a: 'b', c: 'd' }];

    tag.init();
    tag.selectElement = {
      _tag: <Filter & any>{ update: ({ options }) => expect(options).to.eq(refinements) }
    };
    tag.convertRefinements = () => refinements;

    tag.updateValues(<Results>{});
  });

  it('should call reset on clear navigation', (done) => {
    flux.reset = () => done();

    tag.init();

    tag.navigate('*');
  });

  it('should call refine on navigation selected', (done) => {
    const selection = { type: 'Value', value: 'DeWalt' },
      navigationName = 'brand';

    flux.refine = (selected): any => {
      expect(selected).to.eql(Object.assign(selection, { navigationName }));
      done();
    };

    tag.init();
    tag.navField = navigationName;

    tag.navigate(selection);
  });

  it('should call unrefine to clear current selection', (done) => {
    const selection = { a: 'b', c: 'd' };

    flux.unrefine = (selected, opts): any => {
      expect(selected).to.eq(selection);
      expect(opts.skipSearch).to.be.true;
      done();
    };

    tag.init();
    tag.selected = selection;

    tag.navigate('*');
  });
});
