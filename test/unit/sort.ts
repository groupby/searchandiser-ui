import { FluxCapacitor, Events, Results } from 'groupby-api';
import { fluxTag } from '../utils/tags';
import { Sort } from '../../src/tags/sort/gb-sort';
import { expect } from 'chai';

describe('gb-sort logic', () => {
  let tag: Sort,
    flux: FluxCapacitor;

  beforeEach(() => ({ tag, flux } = fluxTag(new Sort())));

  // it('should have default values', () => {
  //   tag.init();
  //   expect(tag.selectConfig).to.be.ok;
  //   expect(tag.selectConfig.hover).to.not.be.ok;
  //   expect(tag.selectConfig.update).to.eq(tag.sort);
  //   expect(tag.selectConfig.options).to.eql(tag.options);
  //   expect(tag.selectConfig.default).to.be.true;
  // });
  //
  // describe('override behaviour', () => {
  //   const options = [
  //     { label: 'Value Descending', value: { field: 'value', order: 'Descending' } },
  //     { label: 'Value Ascending', value: { field: 'value', order: 'Ascending' } }
  //   ];
  //
  //   it('should allow override from opts', () => {
  //     const onHover = false;
  //
  //     Object.assign(tag.opts, { options, onHover });
  //     tag.init();
  //
  //     expect(tag.parentOpts).to.have.all.keys('options', 'onHover');
  //     expect(tag.selectConfig).to.be.ok;
  //     expect(tag.selectConfig.options).to.eq(options);
  //     expect(tag.selectConfig.hover).to.be.false;
  //   });
  //
  //   it('should allow override from tags config', () => {
  //     tag.config = { tags: { sort: { options } } };
  //     tag.init();
  //
  //     expect(tag.selectConfig.options).to.eq(options);
  //   });
  // });
  //
  // it('should return option values', () => {
  //   tag.init();
  //
  //   const values = tag.sortValues();
  //   expect(values).to.eql([
  //     { field: 'title', order: 'Descending' },
  //     { field: 'title', order: 'Ascending' }
  //   ])
  // });
  //
  // it('should sort on value', () => {
  //   const nextSort = { a: 'b', c: 'd' };
  //   const pastSorts = [{ e: 'f' }, { g: 'h' }];
  //
  //   flux.sort = (newSort, oldSorts): any => {
  //     expect(newSort).to.eq(nextSort);
  //     expect(oldSorts).to.eq(pastSorts);
  //   };
  //
  //   tag.sortValues = () => pastSorts;
  //   tag.init();
  //
  //   tag.sort(nextSort);
  // });
});
