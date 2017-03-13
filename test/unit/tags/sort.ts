import { META, Sort } from '../../../src/tags/sort/gb-sort';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-sort', Sort, ({
  flux, tag, stub,
  itShouldAlias,
  itShouldHaveMeta
}) => {
  itShouldHaveMeta(Sort, META);

  describe('init()', () => {
    itShouldAlias('selectable');
  });

  describe('sortValues()', () => {
    it('should return option values', () => {
      tag().items = META.defaults.items;

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

      expect(sort).to.be.calledWith(nextSort, pastSorts);
    });
  });
});
