import { DEFAULT_CONFIG, Paging } from '../../../src/tags/paging/gb-paging';
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
  it('should configure itself with defaults', (done) => {
    tag().configure = (defaults) => {
      expect(defaults).to.eq(DEFAULT_CONFIG);
      done();
    };

    tag().init();
  });

  it('should have default initial state', () => {
    tag().init();

    expect(tag().currentPage).to.eq(1);
    expect(tag().backDisabled).to.be.true;
  });

  it('should have pager', () => {
    tag().init();

    expect(tag().pager).to.be.ok;
    expect(tag().pager).to.have.all.keys('first', 'last', 'next', 'last', 'switchPage');
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
      expect(obj.currentPage).to.eq(43);
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
