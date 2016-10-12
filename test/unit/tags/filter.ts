import { FILTER_UPDATED_EVENT } from '../../../src/services/filter';
import { DEFAULT_CONFIG, Filter } from '../../../src/tags/filter/gb-filter';
import suite from './_suite';
import { expect } from 'chai';
import { Results } from 'groupby-api';

suite('gb-filter', Filter, ({
  flux, tag, sandbox,
  expectSubscriptions,
  itShouldConfigure
}) => {

  describe('init()', () => {
    itShouldConfigure(DEFAULT_CONFIG);

    it('should listen for events', () => {
      expectSubscriptions(() => tag().init(), {
        [FILTER_UPDATED_EVENT]: tag().updateValues
      });
    });
  });

  describe('convertRefinements()', () => {
    it('should convert refinements if found', () => {
      const refinement = { value: 'a', other: 'b' };
      tag().services = <any>{ filter: { isTargetNav: () => true } };

      const converted = tag().convertRefinements([{ refinements: [refinement] }]);

      expect(converted).to.eql([{ label: refinement.value, value: refinement }]);
    });

    it('should return an empty list if not found', () => {
      tag().services = <any>{ filter: { isTargetNav: () => false } };

      const converted = tag().convertRefinements([{ refinements: [{ a: 'b' }] }]);

      expect(converted).to.be.empty;
    });
  });

  describe('updateValues()', () => {
    it('should update the select tag with options', () => {
      const results: any = { x: 'y' };
      const refinements = [{ a: 'b', c: 'd' }];
      const updateOptions = sinon.spy((options) => expect(options).to.eq(refinements));
      tag().tags = <any>{ 'gb-select': { updateOptions } };
      tag().convertRefinements = () => refinements;

      tag().updateValues(results);

      expect(updateOptions.called).to.be.true;
    });

    it('should call update() with options', () => {
      const results: any = { x: 'y' };
      const refinements = [{ a: 'b', c: 'd' }];
      tag().tags = <any>{};
      tag().convertRefinements = () => refinements;
      tag().update = ({ options }) => expect(options).to.eq(refinements);

      tag().updateValues(results);
    });
  });

  describe('onselect()', () => {
    it('should call reset on clear navigation', () => {
      const stub = sandbox().stub(flux(), 'reset');

      tag().onselect('*');

      expect(stub.called).to.be.true;
    });

    it('should call refine on navigation selected', () => {
      const selection = { type: 'Value', value: 'DeWalt' };
      const navigationName = 'brand';
      const stub = sandbox().stub(flux(), 'refine', (selected) =>
        expect(selected).to.eql(Object.assign(selection, { navigationName })));
      tag()._config = { field: navigationName };

      tag().onselect(selection);

      expect(stub.called).to.be.true;
    });

    it('should call unrefine to clear current selection', () => {
      const selection = tag().selected = { a: 'b', c: 'd' };
      const stub = sandbox().stub(flux(), 'unrefine', (selected, opts) => {
        expect(selected).to.eq(selection);
        expect(opts.skipSearch).to.be.true;
      });

      tag().onselect('*');

      expect(stub.called).to.be.true;
    });
  });
});
