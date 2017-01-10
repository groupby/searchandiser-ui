import { DEFAULT_SORTS, Sort } from '../../../src/tags/sort/gb-sort';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-sort', Sort, ({
  flux, tag, stub,
  itShouldAlias
}) => {

  describe('init()', () => {
    itShouldAlias('selectable');

    it('should have default values', () => {
      tag().init();

      expect(tag().items).to.eq(DEFAULT_SORTS);
    });

    it('should set items from opts', () => {
      const items = [
        { label: 'Value Descending', value: { field: 'value', order: 'Descending' } },
        { label: 'Value Ascending', value: { field: 'value', order: 'Ascending' } }
      ];
      tag().opts = { items };

      tag().init();

      expect(tag().items).to.eq(items);
    });
  });

  describe('sortValues()', () => {
    it('should return option values', () => {
      tag().items = DEFAULT_SORTS;

      const values = tag().sortValues();

      expect(values).to.eql([
        { field: 'title', order: 'Descending' },
        { field: 'title', order: 'Ascending' }
      ]);
    });
  });

  describe('onSelect()', () => {
    it('should sort on value', () => {
      const nextSort = { a: 'b', c: 'd' };
      const pastSorts = [{ e: 'f' }, { g: 'h' }];
      const sort = stub(flux(), 'sort');
      tag().sortValues = () => pastSorts;

      tag().onSelect(<any>nextSort);

      expect(sort).to.have.been.calledWith(nextSort, pastSorts);
    });
  });
});
