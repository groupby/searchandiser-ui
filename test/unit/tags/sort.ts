import { Sort } from '../../../src/tags/sort/gb-sort';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-sort', Sort, ({ flux, tag }) => {
  it('should have default values', () => {
    tag().init();

    expect(tag()._config).to.eql({});
    expect(tag().options).to.eql(tag().options);
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

  it('should return option values', () => {
    tag().init();

    const values = tag().sortValues();
    expect(values).to.eql([
      { field: 'title', order: 'Descending' },
      { field: 'title', order: 'Ascending' }
    ]);
  });

  it('should sort on value', () => {
    const nextSort = { a: 'b', c: 'd' };
    const pastSorts = [{ e: 'f' }, { g: 'h' }];

    flux().sort = (newSort, oldSorts): any => {
      expect(newSort).to.eq(nextSort);
      expect(oldSorts).to.eq(pastSorts);
    };

    tag().sortValues = () => pastSorts;
    tag().init();

    tag().onselect(<any>nextSort);
  });
});
