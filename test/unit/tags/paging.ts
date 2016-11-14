import { DEFAULT_CONFIG, Paging } from '../../../src/tags/paging/gb-paging';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-paging', Paging, ({
  flux, tag, spy, stub,
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
      const updatePageInfo = stub(tag(), 'updatePageInfo');
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

      expect(updatePageInfo.calledWith(pageNumbers, 9, 16)).to.be.true;
    });
  });

  describe('updatePageInfo()', () => {
    it('should update page info', () => {
      const pageNumbers = [1, 2, 3, 4, 5, 6];
      const update = tag().update = spy();

      tag().updatePageInfo(pageNumbers, 43, 43);

      expect(update.calledWith({
        pageNumbers,
        backDisabled: false,
        forwardDisabled: true,
        lowOverflow: false,
        highOverflow: true,
        lastPage: 43,
        currentPage: 43
      })).to.be.true;
    });

    it('should set lowOverflow and highOverflow true', () => {
      const update =
        tag().update =
        spy((obj) => {
          expect(obj.lowOverflow).to.be.true;
          expect(obj.highOverflow).to.be.true;
        });

      tag().updatePageInfo([2, 3, 4], 1, 6);

      expect(update.called).to.be.true;
    });

    it('should set lowOverflow and highOverflow to false', () => {
      const update =
        tag().update =
        spy((obj) => {
          expect(obj.lowOverflow).to.be.false;
          expect(obj.highOverflow).to.be.false;
        });

      tag().updatePageInfo([1, 2, 3, 4], 1, 4);

      expect(update.called).to.be.true;
    });

    it('should set backDisabled and forwardDisabled to true', () => {
      const update =
        tag().update =
        spy((obj) => {
          expect(obj.backDisabled).to.be.true;
          expect(obj.forwardDisabled).to.be.true;
        });

      tag().updatePageInfo([1], 1, 1);

      expect(update.called).to.be.true;
    });

    it('should set backDisabled and forwardDisabled to false', () => {
      const update =
        tag().update =
        spy((obj) => {
          expect(obj.backDisabled).to.be.false;
          expect(obj.forwardDisabled).to.be.false;
        });

      tag().updatePageInfo([1, 2, 3], 2, 3);

      expect(update.called).to.be.true;
    });
  });

  describe('updateCurrentPage()', () => {
    it('should update current page', () => {
      const update =
        tag().update =
        spy((obj) => expect(obj.currentPage).to.eq(10));

      tag().updateCurrentPage({ pageNumber: 10 });

      expect(update.called).to.be.true;
    });
  });

  describe('wrapPager()', () => {
    it('first()', (done) => {
      const reset = spy(() => Promise.resolve());
      const pager = tag().wrapPager(<any>{ reset });
      tag().emitEvent = () => {
        expect(reset.called).to.be.true;
        done();
      };

      pager.first();
    });

    it('prev()', (done) => {
      const prev = spy(() => Promise.resolve());
      const pager = tag().wrapPager(<any>{ prev });
      tag().emitEvent = () => {
        expect(prev.called).to.be.true;
        done();
      };

      pager.prev();
    });

    it('next()', (done) => {
      const next = spy(() => Promise.resolve());
      const pager = tag().wrapPager(<any>{ next });
      tag().emitEvent = () => {
        expect(next.called).to.be.true;
        done();
      };

      pager.next();
    });

    it('last()', (done) => {
      const last = spy(() => Promise.resolve());
      const pager = tag().wrapPager(<any>{ last });
      tag().emitEvent = () => {
        expect(last.called).to.be.true;
        done();
      };

      pager.last();
    });

    it('switchPage()', (done) => {
      const newPage = 7;
      const switchPage = spy((page) => Promise.resolve(expect(page).to.eq(newPage)));
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

    it('should check for tracker service', () => {
      tag().services = <any>{};

      tag().emitEvent();
    });
  });
});
