import { FluxCapacitor, Events, Results } from 'groupby-api';
import { Sort } from '../../src/tags/sort/gb-sort';
import { expect } from 'chai';

describe('gb-sort logic', () => {
  let sort: Sort,
    flux: FluxCapacitor;

  beforeEach(() => sort = Object.assign(new Sort(), {
    flux: flux = new FluxCapacitor(''),
    opts: {}
  }));

  it('should have default values', () => {
    sort.init();
    expect(sort.passthrough).to.be.ok;
    expect(sort.passthrough.hover).to.not.be.ok;
    expect(sort.passthrough.update).to.eq(sort.sort);
    expect(sort.passthrough.options).to.eql(sort.options);
    expect(sort.passthrough.default).to.be.true;
  });

  describe('override behaviour', () => {
    const options = [
      { label: 'Value Descending', value: { field: 'value', order: 'Descending' } },
      { label: 'Value Ascending', value: { field: 'value', order: 'Ascending' } }
    ];

    it('should allow override from opts', () => {
      const onHover = false;

      Object.assign(sort.opts, { options, onHover });
      sort.init();

      expect(sort.parentOpts).to.have.all.keys('options', 'onHover');
      expect(sort.passthrough).to.be.ok;
      expect(sort.passthrough.options).to.eq(options);
      expect(sort.passthrough.hover).to.be.false;
    });

    it('should allow override from tags config', () => {
      Object.assign(sort.opts, { config: { tags: { sort: { options } } } });
      sort.init();

      expect(sort.passthrough.options).to.eq(options);
    });
  });

  it('should return option values', () => {
    sort.init();

    const values = sort.sortValues();
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

    sort.sortValues = () => pastSorts;
    sort.init();

    sort.sort(nextSort);
  });
});
