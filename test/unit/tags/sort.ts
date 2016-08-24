import { FluxCapacitor, Events, Results } from 'groupby-api';
import { fluxTag } from '../../utils/tags';
import { Sort } from '../../../src/tags/sort/gb-sort';
import { expect } from 'chai';

describe('gb-sort logic', () => {
  let tag: Sort,
    flux: FluxCapacitor;

  beforeEach(() => ({ tag, flux } = fluxTag(new Sort())));

  it('should have default values', () => {
    tag.init();

    expect(tag.options).to.eql(tag.options);
  });

  describe('override behaviour', () => {
    const options = [
      { label: 'Value Descending', value: { field: 'value', order: 'Descending' } },
      { label: 'Value Ascending', value: { field: 'value', order: 'Ascending' } }
    ];

    it('should allow override from opts', () => {
      Object.assign(tag.opts, { options });
      tag.init();

      expect(tag.options).to.eq(options);
    });

    it('should allow override from tags config', () => {
      tag.config = { tags: { sort: { options } } };
      tag.init();

      expect(tag.options).to.eq(options);
    });
  });

  it('should return option values', () => {
    tag.init();

    const values = tag.sortValues();
    expect(values).to.eql([
      { field: 'title', order: 'Descending' },
      { field: 'title', order: 'Ascending' }
    ])
  });

  it('should sort on value', () => {
    const nextSort = { a: 'b', c: 'd' };
    const pastSorts = [{ e: 'f' }, { g: 'h' }];

    flux.sort = (newSort, oldSorts): any => {
      expect(newSort).to.eq(nextSort);
      expect(oldSorts).to.eq(pastSorts);
    };

    tag.sortValues = () => pastSorts;
    tag.init();

    tag.onselect(nextSort);
  });
});
