import { Paging } from '../../../src/tags/paging/gb-paging';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

const struct = { title: 'title', price: 'price', image: 'image', url: 'url' };
const allMeta = {
  title: 'Red Sneakers',
  price: '$12.45',
  image: 'image.png',
  id: '1340',
  nested: {
    value: '6532'
  }
};

suite('gb-paging', Paging, { parent: { struct, allMeta } }, ({ flux, tag }) => {
  it('should have default initial state', () => {
    tag().init();

    expect(tag().currentPage).to.eq(1);
    expect(tag().backDisabled).to.be.true;
  });

  it('should inherit values from parent', () => {
    tag().init();

    expect(tag().limit).to.eq(5);
    expect(tag().pages).to.be.false;
    expect(tag().numeric).to.be.false;
    expect(tag().terminals).to.be.true;
    expect(tag().icons).to.be.true;

    expect(tag().pager).to.be.ok;
    expect(tag().pager).to.have.all.keys('first', 'last', 'next', 'last', 'jump');

    expect(tag().prev_label).to.not.be.ok;
    expect(tag().next_label).to.not.be.ok;
    expect(tag().first_label).to.not.be.ok;
    expect(tag().last_label).to.not.be.ok;

    expect(tag().prev_icon).to.not.be.ok;
    expect(tag().next_icon).to.not.be.ok;
    expect(tag().first_icon).to.not.be.ok;
    expect(tag().last_icon).to.not.be.ok;
  });

  it('should allow override from opts', () => {
    const overrides = {
      limit: 7,
      pages: true,
      numeric: true,
      terminals: false,
      icons: false,
      prev_label: 'back',
      next_label: 'forward',
      first_label: 'beginning',
      last_label: 'end',
      prev_icon: 'fa fa-backward',
      next_icon: 'fa fa-forward',
      first_icon: 'fa fa-double-backward',
      last_icon: 'fa fa-double-forward'
    };
    tag().opts = overrides;
    tag().init();

    expect(tag().limit).to.eq(overrides.limit);
    expect(tag().pages).to.be.true;
    expect(tag().numeric).to.be.true;
    expect(tag().terminals).to.be.false;
    expect(tag().icons).to.be.false;
    expect(tag().prev_label).to.eq(overrides.prev_label);
    expect(tag().next_label).to.eq(overrides.next_label);
    expect(tag().first_label).to.eq(overrides.first_label);
    expect(tag().last_label).to.eq(overrides.last_label);
    expect(tag().prev_icon).to.eq(overrides.prev_icon);
    expect(tag().next_icon).to.eq(overrides.next_icon);
    expect(tag().first_icon).to.eq(overrides.first_icon);
    expect(tag().last_icon).to.eq(overrides.last_icon);
  });

  it('should listen for events', () => {
    flux().on = (event: string): any => expect(event).to.be.oneOf([Events.RESULTS, Events.PAGE_CHANGED]);

    tag().init();
  });

  it('should update page position', (done) => {
    const pageNumbers = [1, 2, 3, 4, 5];
    const pager = {
      pageNumbers: (limit) => {
        expect(limit).to.eq(5);
        return pageNumbers;
      },
      finalPage: 16
    };

    Object.defineProperty(flux(), 'page', { get: () => pager });

    tag().pageInfo = (pages, last): any => {
      expect(pages).to.eq(pageNumbers);
      expect(last).to.eq(17);
      done();
    };
    tag().init();

    tag().updatePageInfo();
  });

  it('should update page info', () => {
    tag().update = (obj: any) => {
      expect(obj.currentPage).to.eq(14);
      expect(obj.lastPage).to.eq(44);
      expect(obj.backDisabled).to.be.false;
      expect(obj.forwardDisabled).to.be.false;
    };
    tag().init();

    tag().updatePages({ pageIndex: 13, finalPage: 43 });
  });

  it('should generate page info', () => {
    const pageNumbers = [4, 5, 6, 7, 8];

    tag().init();

    const pageInfo = tag().pageInfo(pageNumbers, 14);
    expect(pageInfo.pageNumbers).to.eq(pageNumbers);
    expect(pageInfo.lowOverflow).to.be.true;
    expect(pageInfo.highOverflow).to.be.true;

    expect(tag().pageInfo([1], 2).lowOverflow).to.be.false;
    expect(tag().pageInfo([4, 5, 6], 6).highOverflow).to.be.false;
  });

  describe('page transition behaviour', () => {
    it('should not allow page forward', () => {
      const pager = {
        next: () => expect.fail(),
        last: () => expect.fail()
      };
      Object.defineProperty(flux(), 'page', { get: () => pager });

      tag().init();
      tag().forwardDisabled = true;

      tag().pager.next();
      tag().pager.last();
    });

    it('should not allow page backward', () => {
      const pager = {
        prev: () => expect.fail(),
        first: () => expect.fail()
      };
      Object.defineProperty(flux(), 'page', { get: () => pager });

      tag().init();
      tag().backDisabled = true;

      tag().pager.prev();
      tag().pager.first();
    });

    it('should jump to the given page', () => {
      const newPage = 7;
      const pager = { jump: (page) => expect(page).to.eq(newPage) };
      Object.defineProperty(flux(), 'page', { get: () => pager });

      tag().init();

      tag().pager.jump(newPage);
    });
  });
});
