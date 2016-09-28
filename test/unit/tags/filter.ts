import { FILTER_UPDATED_EVENT } from '../../../src/services/filter';
import { Filter } from '../../../src/tags/filter/gb-filter';
import suite from './_suite';
import { expect } from 'chai';
import { FluxCapacitor, Results } from 'groupby-api';

suite('gb-filter', Filter, ({ flux, tag: _tag }) => {
  let tag: Filter;
  let fluxClone: FluxCapacitor;

  beforeEach(() => {
    tag = Object.assign(_tag(), { _clone: () => fluxClone = new FluxCapacitor('') });
  });

  it('should have default values', () => {
    tag.init();

    expect(tag._config).to.eql({});
    expect(tag.label).to.eq('Filter');
    expect(tag.clear).to.eq('Unfiltered');
  });

  it('should allow override from opts', () => {
    const label = 'Select Brand';
    const clear = 'All Brands';
    const field = 'Brand';

    tag.opts = { label, clear, field };
    tag.init();

    expect(tag._config).to.eq(tag.opts);
  });

  it('should listen for events', () => {
    flux().on = (event: string): any => expect(event).to.eq(FILTER_UPDATED_EVENT);

    tag.init();
  });

  it('should call updateFluxClone on RESULTS', () => {
    flux().on = (event: string, cb: Function): any => expect(cb).to.eq(tag.updateValues);

    tag.init();
  });

  it('should convert refinements if found', () => {
    const refinement = { value: 'a', other: 'b' };

    tag.init();
    tag.services = <any>{ filter: { isTargetNav: () => true } };

    const converted = tag.convertRefinements([{ refinements: [refinement] }]);
    expect(converted).to.eql([{ label: refinement.value, value: refinement }]);
  });

  it('should return an empty list if not found', () => {
    tag.init();
    tag.services = <any>{ filter: { isTargetNav: () => false } };

    const converted = tag.convertRefinements([{ refinements: [{ a: 'b' }] }]);
    expect(converted.length).to.eq(0);
  });

  it('should update the select tag with options', () => {
    const refinements = [{ a: 'b', c: 'd' }];

    tag.init();
    tag.tags = <any>{
      'gb-select': {
        updateOptions: (options) => expect(options).to.eq(refinements)
      }
    };
    tag.convertRefinements = () => refinements;

    tag.updateValues(<Results>{});
  });

  it('should call reset on clear navigation', (done) => {
    flux().reset = () => done();

    tag.init();

    tag.onselect('*');
  });

  it('should call refine on navigation selected', (done) => {
    const selection = { type: 'Value', value: 'DeWalt' };
    const navigationName = 'brand';

    flux().refine = (selected): any => {
      expect(selected).to.eql(Object.assign(selection, { navigationName }));
      done();
    };

    tag.init();
    tag._config.field = navigationName;

    tag.onselect(selection);
  });

  it('should call unrefine to clear current selection', (done) => {
    const selection = { a: 'b', c: 'd' };

    flux().unrefine = (selected, opts): any => {
      expect(selected).to.eq(selection);
      expect(opts.skipSearch).to.be.true;
      done();
    };

    tag.init();
    tag.selected = selection;

    tag.onselect('*');
  });
});
