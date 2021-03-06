import { FILTER_UPDATED_EVENT } from '../../../src/services/filter';
import { Filter, META } from '../../../src/tags/filter/gb-filter';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-filter', Filter, ({
  flux, tag, spy, stub,
  expectSubscriptions,
  itShouldHaveMeta,
  itShouldAlias
}) => {
  itShouldHaveMeta(Filter, META);

  describe('init()', () => {
    itShouldAlias('selectable');

    it('should listen for events', () => {
      expectSubscriptions(() => tag().init(), {
        [FILTER_UPDATED_EVENT]: tag().updateValues
      });
    });

    it('should register with filter service', () => {
      const register = tag().register = spy();

      tag().init();

      expect(register).to.be.calledWith('filter');
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

      expect(converted).to.eql([]);
    });
  });

  describe('updateValues()', () => {
    it('should call update() with options', () => {
      const results: any = { x: 'y' };
      const items = [{ a: 'b', c: 'd' }];
      const update = tag().update = spy();
      tag().convertRefinements = () => items;

      tag().updateValues(results);

      expect(update).to.be.calledWith({ items });
    });
  });

  describe('onSelect()', () => {
    it('should call reset on clear navigation', () => {
      const reset = stub(flux(), 'reset');

      tag().onSelect('*');

      expect(reset).to.be.called;
    });

    it('should call refine on navigation selected', () => {
      const selection = { type: 'Value', value: 'DeWalt' };
      const navigationName = 'brand';
      const refine = stub(flux(), 'refine');
      tag().field = navigationName;

      tag().onSelect(selection);

      expect(refine).to.be.calledWith(Object.assign(selection, { navigationName }));
    });

    it('should call unrefine to clear current selection', () => {
      const selection = tag().selected = { a: 'b', c: 'd' };
      const unrefine = stub(flux(), 'unrefine');

      tag().onSelect('*');

      expect(unrefine).to.be.calledWith(selection, { skipSearch: true });
    });
  });
});
