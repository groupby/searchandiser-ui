import { DEFAULT_SORTS, Sort } from '../../../src/tags/sort/gb-sort';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-sort', Sort, ({
  flux, tag, stub,
  itShouldConfigure
}) => {

  describe('init()', () => {
    itShouldConfigure();

    it('should have default values', () => {
      tag().init();

      expect(tag().options).to.eq(DEFAULT_SORTS);
    });

    it('should set options from computed config', () => {
      const options = [
        { label: 'Value Descending', value: { field: 'value', order: 'Descending' } },
        { label: 'Value Ascending', value: { field: 'value', order: 'Ascending' } }
      ];
      tag().configure = () => tag()._config = { options };

      tag().init();

      expect(tag().options).to.eq(options);
    });
  });

  describe('sortValues()', () => {
    it('should return option values', () => {
      tag().options = DEFAULT_SORTS;

      const values = tag().sortValues();

      expect(values).to.eql([
        { field: 'title', order: 'Descending' },
        { field: 'title', order: 'Ascending' }
      ]);
    });
  });

  describe('onselect()', () => {
    it('should sort on value', () => {
      const nextSort = { a: 'b', c: 'd' };
      const pastSorts = [{ e: 'f' }, { g: 'h' }];
      const sort = stub(flux(), 'sort');
      tag().sortValues = () => pastSorts;

      tag().onselect(<any>nextSort);

      expect(sort.calledWith(nextSort, pastSorts)).to.be.true;
    });
  });
});
