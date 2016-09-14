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
    expect(tag().labels).to.be.true;
    expect(tag().icons).to.be.true;

    expect(tag().pager).to.be.ok;
    expect(tag().pager).to.have.all.keys('first', 'last', 'next', 'last', 'switchPage');

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
      labels: false,
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
    expect(tag().labels).to.be.false;
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
      currentPage: 9,
      finalPage: 16
    };

    Object.defineProperty(flux(), 'page', { get: () => pager });

    tag().updatePageInfo = (pages, current, last): any => {
      expect(pages).to.eq(pageNumbers);
      expect(current).to.eq(9);
      expect(last).to.eq(16);
      done();
    };
    tag().init();

    tag().pageInfo();
  });

  it('should update page info', () => {
    tag().update = (obj: any) => {
      expect(obj.backDisabled).to.be.false;
      expect(obj.forwardDisabled).to.be.true;
      expect(obj.lowOverflow).to.be.false;
      expect(obj.highOverflow).to.be.true;
      expect(obj.pageNumbers).to.eql([1, 2, 3, 4, 5, 6]);
      expect(obj.lastPage).to.eq(43);
    };

    tag().init();
    tag().updatePageInfo([1, 2, 3, 4, 5, 6], 43, 43);
  });

  it('should update current page', () => {
    tag().update = (obj: any) => {
      expect(obj.currentPage).to.eq(10);
    };

    tag().init();
    tag().updateCurrentPage({ pageNumber: 10 });
  });

  it('should set lowOverflow and highOverflow true', () => {
    tag().update = (obj: any) => {
      expect(obj.lowOverflow).to.be.true;
      expect(obj.highOverflow).to.be.true;
    };

    tag().init();
    tag().updatePageInfo([2, 3, 4], 1, 6);
  });

  it('should set lowOverflow and highOverflow to false', () => {
    tag().update = (obj: any) => {
      expect(obj.lowOverflow).to.be.false;
      expect(obj.highOverflow).to.be.false;
    };

    tag().init();
    tag().updatePageInfo([1, 2, 3, 4], 1, 4);
  });

  it('should set backDisabled and forwardDisabled to true', () => {
    tag().update = (obj: any) => {
      expect(obj.backDisabled).to.be.true;
      expect(obj.forwardDisabled).to.be.true;
    };

    tag().init();
    tag().updatePageInfo([1], 1, 1);
  });

  it('should set backDisabled and forwardDisabled to false', () => {
    tag().update = (obj: any) => {
      expect(obj.backDisabled).to.be.false;
      expect(obj.forwardDisabled).to.be.false;
    };

    tag().init();
    tag().updatePageInfo([1, 2, 3], 2, 3);
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

    it('should switch to the given page', () => {
      const newPage = 7;
      const pager = { switchPage: (page) => expect(page).to.eq(newPage) };
      Object.defineProperty(flux(), 'page', { get: () => pager });
      flux().page.pageExists = () => true;

      tag().init();

      tag().pager.switchPage(newPage);
    });
  });
});
