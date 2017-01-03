import { Paging, SCHEMA } from '../../../src/tags/paging/gb-paging';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-paging', Paging, ({
  flux, tag, spy, stub,
  expectSubscriptions
}) => {

  describe('init()', () => {
    it('should expose a schema', (done) => {
      tag().$schema = (config) => {
        Object.keys(SCHEMA)
          .forEach((key) => expect(config).to.have.property(key, SCHEMA[key]));
        done();
      };

      tag().init();
    });

    it('should wrap flux.page as pager', () => {
      const fluxPager = flux().page = <any>{ a: 'b' };
      const wrappedPager = { c: 'd' };
      tag().wrapPager = (pager) => {
        expect(pager).to.eq(fluxPager);
        return wrappedPager;
      };

      tag().init();
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
      tag().$internal = { limit };
      flux().page = <any>{
        pageNumbers: (pages) => {
          expect(pages).to.eq(limit);
          return pageNumbers;
        },
        currentPage: 9,
        finalPage: 16
      };

      tag().pageInfo();

      expect(updatePageInfo).to.have.been.calledWith(pageNumbers, 9, 16);
    });
  });

  describe('updatePageInfo()', () => {
    it('should update page info', () => {
      const pageNumbers = [1, 2, 3, 4, 5, 6];
      const update = tag().$update = spy();

      tag().updatePageInfo(pageNumbers, 43, 43);

      expect(update.calledWith({
        pageNumbers,
        backDisabled: false,
        forwardDisabled: true,
        lowOverflow: false,
        highOverflow: true,
        finalPage: 43,
        currentPage: 43
      })).to.be.true;
    });

    it('should set lowOverflow and highOverflow true', () => {
      const update = tag().$update = spy();

      tag().updatePageInfo([2, 3, 4], 1, 6);

      expect(update).to.have.been.calledWithMatch({
        lowOverflow: true,
        highOverflow: true
      });
    });

    it('should set lowOverflow and highOverflow to false', () => {
      const update = tag().$update = spy();

      tag().updatePageInfo([1, 2, 3, 4], 1, 4);

      expect(update).to.have.been.calledWithMatch({
        lowOverflow: false,
        highOverflow: false
      });
    });

    it('should set backDisabled and forwardDisabled to true', () => {
      const update = tag().$update = spy();

      tag().updatePageInfo([1], 1, 1);

      expect(update).to.have.been.calledWithMatch({
        backDisabled: true,
        forwardDisabled: true
      });
    });

    it('should set backDisabled and forwardDisabled to false', () => {
      const update = tag().$update = spy();

      tag().updatePageInfo([1, 2, 3], 2, 3);

      expect(update).to.have.been.calledWithMatch({
        backDisabled: false,
        forwardDisabled: false
      });
    });
  });

  describe('updateCurrentPage()', () => {
    it('should update current page', () => {
      const update = tag().$update = spy();

      tag().updateCurrentPage({ pageNumber: 10 });

      expect(update).to.have.been.calledWithMatch({ currentPage: 10 });
    });
  });

  describe('wrapPager()', () => {
    beforeEach(() => tag().$internal = {});

    it('firstPage()', (done) => {
      const reset = spy(() => Promise.resolve());
      const pager = tag().wrapPager(<any>{ reset });
      tag().emitEvent = () => {
        expect(reset).to.have.been.called;
        done();
      };

      pager.firstPage.value();
    });

    it('prevPage()', (done) => {
      const prev = spy(() => Promise.resolve());
      const pager = tag().wrapPager(<any>{ prev });
      tag().emitEvent = () => {
        expect(prev).to.have.been.called;
        done();
      };

      pager.prevPage.value();
    });

    it('nextPage()', (done) => {
      const next = spy(() => Promise.resolve());
      const pager = tag().wrapPager(<any>{ next });
      tag().emitEvent = () => {
        expect(next).to.have.been.called;
        done();
      };

      pager.nextPage.value();
    });

    it('lastPage()', (done) => {
      const last = spy(() => Promise.resolve());
      const pager = tag().wrapPager(<any>{ last });
      tag().emitEvent = () => {
        expect(last).to.have.been.called;
        done();
      };

      pager.lastPage.value();
    });

    it('switchPage()', (done) => {
      const switchPage = spy(() => Promise.resolve());
      const pager = tag().wrapPager(<any>{ switchPage });
      tag().emitEvent = () => {
        expect(switchPage).to.have.been.calledWith(7);
        done();
      };

      pager.switchPage.value({ target: { text: '7' } });
    });

    it('should not allow page forward', () => {
      tag().$internal.forwardDisabled = true;

      const pager = tag().wrapPager(<any>{
        next: () => expect.fail(),
        last: () => expect.fail()
      });

      pager.nextPage.value();
      pager.lastPage.value();
    });

    it('should not allow page backward', () => {
      tag().$internal.backDisabled = true;

      const pager = tag().wrapPager(<any>{
        prev: () => expect.fail(),
        first: () => expect.fail()
      });

      pager.prevPage.value();
      pager.firstPage.value();
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
