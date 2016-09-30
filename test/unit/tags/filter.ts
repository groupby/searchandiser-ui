import { FILTER_UPDATED_EVENT } from '../../../src/services/filter';
import { DEFAULT_CONFIG, Filter } from '../../../src/tags/filter/gb-filter';
import suite from './_suite';
import { expect } from 'chai';
import { Results } from 'groupby-api';

suite('gb-filter', Filter, ({ flux, tag }) => {
  it('should configure itself with defaults', (done) => {
    tag().configure = (defaults) => {
      expect(defaults).to.eq(DEFAULT_CONFIG);
      done();
    };

    tag().init();
  });

  it('should listen for events', () => {
    flux().on = (event: string): any => expect(event).to.eq(FILTER_UPDATED_EVENT);

    tag().init();
  });

  it('should call updateFluxClone on RESULTS', () => {
    flux().on = (event: string, cb: Function): any => expect(cb).to.eq(tag().updateValues);

    tag().init();
  });

  it('should convert refinements if found', () => {
    const refinement = { value: 'a', other: 'b' };

    tag().init();
    tag().services = <any>{ filter: { isTargetNav: () => true } };

    const converted = tag().convertRefinements([{ refinements: [refinement] }]);
    expect(converted).to.eql([{ label: refinement.value, value: refinement }]);
  });

  it('should return an empty list if not found', () => {
    tag().init();
    tag().services = <any>{ filter: { isTargetNav: () => false } };

    const converted = tag().convertRefinements([{ refinements: [{ a: 'b' }] }]);
    expect(converted.length).to.eq(0);
  });

  it('should update the select tag with options', () => {
    const refinements = [{ a: 'b', c: 'd' }];

    tag().init();
    tag().tags = <any>{
      'gb-select': {
        updateOptions: (options) => expect(options).to.eq(refinements)
      }
    };
    tag().convertRefinements = () => refinements;

    tag().updateValues(<Results>{});
  });

  it('should call reset on clear navigation', (done) => {
    flux().reset = () => done();

    tag().init();

    tag().onselect('*');
  });

  it('should call refine on navigation selected', (done) => {
    const selection = { type: 'Value', value: 'DeWalt' };
    const navigationName = 'brand';

    flux().refine = (selected): any => {
      expect(selected).to.eql(Object.assign(selection, { navigationName }));
      done();
    };

    tag().init();
    tag()._config.field = navigationName;

    tag().onselect(selection);
  });

  it('should call unrefine to clear current selection', (done) => {
    const selection = { a: 'b', c: 'd' };

    flux().unrefine = (selected, opts): any => {
      expect(selected).to.eq(selection);
      expect(opts.skipSearch).to.be.true;
      done();
    };

    tag().init();
    tag().selected = selection;

    tag().onselect('*');
  });
});
