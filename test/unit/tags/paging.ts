import { DEFAULT_CONFIG, Paging } from '../../../src/tags/paging/gb-paging';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-paging', Paging, ({
  flux, tag, sandbox,
  expectSubscriptions,
  itShouldConfigure
}) => {

  describe('init()', () => {
    itShouldConfigure(DEFAULT_CONFIG);

    it('should have default initial state', () => {
      tag().init();

      expect(tag().currentPage).to.eq(1);
      expect(tag().backDisabled).to.be.true;
    });

    it('should wrap flux.page as pager', () => {
      const fluxPager = flux().page = <any>{ a: 'b' };
      const wrappedPager = { c: 'd' };
      tag().wrapPager = (pager) => {
        expect(pager).to.eq(fluxPager);
        return wrappedPager;
      };

      tag().init();

      expect(tag().pager).to.eq(wrappedPager);
    });

    it('should listen for events', () => {
      expectSubscriptions(() => tag().init(), {
        [Events.PAGE_CHANGED]: tag().updateCurrentPage,
        [Events.RESULTS]: tag().pageInfo
      });
    });
  });

  describe('pageInfo()', () => {
    it('should update page position', () => {
      const pageNumbers = [1, 2, 3, 4, 5];
      const limit = 7;
      const stub = sandbox().stub(tag(), 'updatePageInfo', (pages, current, last) => {
        expect(pages).to.eq(pageNumbers);
        expect(current).to.eq(9);
        expect(last).to.eq(16);
      });
      tag()._config = { limit };
      flux().page = <any>{
        pageNumbers: (pages) => {
          expect(pages).to.eq(limit);
          return pageNumbers;
        },
        currentPage: 9,
        finalPage: 16
      };

      tag().pageInfo();

      expect(stub.called).to.be.true;
    });
  });

  describe('updatePageInfo()', () => {
    it('should update page info', () => {
      const spy =
        tag().update =
        sinon.spy((obj) => {
          expect(obj.backDisabled).to.be.false;
          expect(obj.forwardDisabled).to.be.true;
          expect(obj.lowOverflow).to.be.false;
          expect(obj.highOverflow).to.be.true;
          expect(obj.pageNumbers).to.eql([1, 2, 3, 4, 5, 6]);
          expect(obj.lastPage).to.eq(43);
          expect(obj.currentPage).to.eq(43);
        });

      tag().updatePageInfo([1, 2, 3, 4, 5, 6], 43, 43);

      expect(spy.called).to.be.true;
    });

    it('should set lowOverflow and highOverflow true', () => {
      const spy =
        tag().update =
        sinon.spy((obj) => {
          expect(obj.lowOverflow).to.be.true;
          expect(obj.highOverflow).to.be.true;
        });

      tag().updatePageInfo([2, 3, 4], 1, 6);

      expect(spy.called).to.be.true;
    });

    it('should set lowOverflow and highOverflow to false', () => {
      const spy =
        tag().update =
        sinon.spy((obj) => {
          expect(obj.lowOverflow).to.be.false;
          expect(obj.highOverflow).to.be.false;
        });

      tag().updatePageInfo([1, 2, 3, 4], 1, 4);

      expect(spy.called).to.be.true;
    });

    it('should set backDisabled and forwardDisabled to true', () => {
      const spy =
        tag().update =
        sinon.spy((obj) => {
          expect(obj.backDisabled).to.be.true;
          expect(obj.forwardDisabled).to.be.true;
        });

      tag().updatePageInfo([1], 1, 1);

      expect(spy.called).to.be.true;
    });

    it('should set backDisabled and forwardDisabled to false', () => {
      const spy =
        tag().update =
        sinon.spy((obj) => {
          expect(obj.backDisabled).to.be.false;
          expect(obj.forwardDisabled).to.be.false;
        });

      tag().updatePageInfo([1, 2, 3], 2, 3);

      expect(spy.called).to.be.true;
    });
  });

  describe('updateCurrentPage()', () => {
    it('should update current page', () => {
      const spy =
        tag().update =
        sinon.spy((obj) => expect(obj.currentPage).to.eq(10));

      tag().updateCurrentPage({ pageNumber: 10 });

      expect(spy.called).to.be.true;
    });
  });

  describe('wrapPager()', () => {
    it('first()', () => {
      const reset = sinon.spy((page) => Promise.resolve());
      const pager = tag().wrapPager(<any>{ reset });

      pager.first();

      expect(reset.called).to.be.true;
    });

    it('prev()', () => {
      const prev = sinon.spy((page) => Promise.resolve());
      const pager = tag().wrapPager(<any>{ prev });

      pager.prev();

      expect(prev.called).to.be.true;
    });

    it('next()', () => {
      const next = sinon.spy((page) => Promise.resolve());
      const pager = tag().wrapPager(<any>{ next });

      pager.next();

      expect(next.called).to.be.true;
    });

    it('last()', () => {
      const last = sinon.spy((page) => Promise.resolve());
      const pager = tag().wrapPager(<any>{ last });

      pager.last();

      expect(last.called).to.be.true;
    });

    it('switchPage()', (done) => {
      const newPage = 7;
      const switchPage = sinon.spy((page) => Promise.resolve(expect(page).to.eq(newPage)));
      const pager = tag().wrapPager(<any>{ switchPage });
      tag().emitEvent = () => {
        expect(switchPage.called).to.be.true;
        done();
      };

      pager.switchPage(newPage);
    });

    it('should not allow page forward', () => {
      tag().forwardDisabled = true;

      const pager = tag().wrapPager(<any>{
        next: () => expect.fail(),
        last: () => expect.fail()
      });

      pager.next();
      pager.last();
    });

    it('should not allow page backward', () => {
      tag().backDisabled = true;

      const pager = tag().wrapPager(<any>{
        prev: () => expect.fail(),
        first: () => expect.fail()
      });

      pager.prev();
      pager.first();
    });
  });

  describe('emitEvent()', () => {
    it('should emit search event', (done) => {
      tag().services = <any>{ tracker: { search: () => done() } };

      tag().emitEvent();
    });
  });
});
