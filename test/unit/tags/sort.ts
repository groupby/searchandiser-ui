import { DEFAULTS, Sort } from '../../../src/tags/sort/gb-sort';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-sort', Sort, ({
  flux, tag, stub, spy,
  itShouldAlias
}) => {

  describe('init()', () => {
    itShouldAlias('selectable');
  });

  describe('onConfigure()', () => {
    it('should call configure()', () => {
      const configure = spy();

      tag().onConfigure(configure);

      expect(configure).to.have.been.calledWith({ defaults: DEFAULTS });
    });
  });

  describe('sortValues()', () => {
    it('should return option values', () => {
      tag().items = DEFAULTS.items;

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
