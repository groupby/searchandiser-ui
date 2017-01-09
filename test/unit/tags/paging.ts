import { Paging } from '../../../src/tags/paging/gb-paging';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-paging', Paging, ({
  flux, tag, spy, stub,
  expectSubscriptions, expectAliases
}) => {

  describe('init()', () => {
    it('should alias self as pageable', () => {
      expectAliases(() => tag().init(), { pageable: tag() });
    });

    it('should have default initial state', () => {
      tag().init();

      expect(tag().limit).to.eq(5);
      expect(tag().pages).to.be.false;
      expect(tag().numeric).to.be.false;
      expect(tag().terminals).to.be.true;
      expect(tag().labels).to.be.true;
      expect(tag().icons).to.be.true;
      expect(tag().first_label).to.eq('First');
      expect(tag().prev_label).to.eq('Prev');
      expect(tag().next_label).to.eq('Next');
      expect(tag().last_label).to.eq('Last');
      expect(tag().first_icon).to.have.string('data:image/png');
      expect(tag().prev_icon).to.have.string('data:image/png');
      expect(tag().next_icon).to.have.string('data:image/png');
      expect(tag().last_icon).to.have.string('data:image/png');
      expect(tag().currentPage).to.eq(1);
      expect(tag().backDisabled).to.be.true;
    });

    it('should set properties from opts', () => {
      tag().opts = {
        limit: 10,
        pages: true,
        numeric: true,
        terminals: false,
        labels: false,
        icons: false,
        first_label: 'first',
        prev_label: 'prev',
        next_label: 'next',
        last_label: 'last',
        first_icon: 'first_icon',
        prev_icon: 'prev_icon',
        next_icon: 'next_icon',
        last_icon: 'last_icon'
      };

      tag().init();

      expect(tag().limit).to.eq(10);
      expect(tag().pages).to.be.true;
      expect(tag().numeric).to.be.true;
      expect(tag().terminals).to.be.false;
      expect(tag().labels).to.be.false;
      expect(tag().icons).to.be.false;
      expect(tag().first_label).to.eq('first');
      expect(tag().prev_label).to.eq('prev');
      expect(tag().next_label).to.eq('next');
      expect(tag().last_label).to.eq('last');
      expect(tag().first_icon).to.eq('first_icon');
      expect(tag().prev_icon).to.eq('prev_icon');
      expect(tag().next_icon).to.eq('next_icon');
      expect(tag().last_icon).to.eq('last_icon');
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
      const limit = tag().limit = 7;
      const updatePageInfo = stub(tag(), 'updatePageInfo');
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
      const update = tag().update = spy();

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
      const update = tag().update = spy();

      tag().updatePageInfo([2, 3, 4], 1, 6);

      expect(update).to.have.been.calledWithMatch({
        lowOverflow: true,
        highOverflow: true
      });
    });

    it('should set lowOverflow and highOverflow to false', () => {
      const update = tag().update = spy();

      tag().updatePageInfo([1, 2, 3, 4], 1, 4);

      expect(update).to.have.been.calledWithMatch({
        lowOverflow: false,
        highOverflow: false
      });
    });

    it('should set backDisabled and forwardDisabled to true', () => {
      const update = tag().update = spy();

      tag().updatePageInfo([1], 1, 1);

      expect(update).to.have.been.calledWithMatch({
        backDisabled: true,
        forwardDisabled: true
      });
    });

    it('should set backDisabled and forwardDisabled to false', () => {
      const update = tag().update = spy();

      tag().updatePageInfo([1, 2, 3], 2, 3);

      expect(update).to.have.been.calledWithMatch({
        backDisabled: false,
        forwardDisabled: false
      });
    });
  });

  describe('updateCurrentPage()', () => {
    it('should update current page', () => {
      const update = tag().update = spy();

      tag().updateCurrentPage({ pageNumber: 10 });

      expect(update).to.have.been.calledWithMatch({ currentPage: 10 });
    });
  });

  describe('firstPage()', () => {
    it('should call flux.page.reset()', (done) => {
      const reset = spy(() => Promise.resolve());
      flux().page = <any>{ reset };
      tag().emitEvent = () => {
        expect(reset).to.have.been.called;
        done();
      };

      tag().firstPage();
    });

    it('should not allow paging back', () => {
      tag().backDisabled = true;
      flux().page = <any>{ reset: () => expect.fail() };

      tag().firstPage();
    });
  });

  describe('prevPage()', () => {
    it('should call flux.page.prev()', (done) => {
      const prev = spy(() => Promise.resolve());
      flux().page = <any>{ prev };
      tag().emitEvent = () => {
        expect(prev).to.have.been.called;
        done();
      };

      tag().prevPage();
    });

    it('should not allow paging back', () => {
      tag().backDisabled = true;
      flux().page = <any>{ prev: () => expect.fail() };

      tag().prevPage();
    });
  });

  describe('nextPage()', () => {
    it('should call flux.page.next()', (done) => {
      const next = spy(() => Promise.resolve());
      flux().page = <any>{ next };
      tag().emitEvent = () => {
        expect(next).to.have.been.called;
        done();
      };

      tag().nextPage();
    });

    it('should not allow paging forward', () => {
      tag().forwardDisabled = true;
      flux().page = <any>{ next: () => expect.fail() };

      tag().nextPage();
    });
  });

  describe('lastPage()', () => {
    it('should call flux.page.last()', (done) => {
      const last = spy(() => Promise.resolve());
      flux().page = <any>{ last };
      tag().emitEvent = () => {
        expect(last).to.have.been.called;
        done();
      };

      tag().lastPage();
    });

    it('should not allow paging forward', () => {
      tag().forwardDisabled = true;
      flux().page = <any>{ last: () => expect.fail() };

      tag().lastPage();
    });
  });

  describe('switchPage()', () => {
    it('should call flux.page.switchPage()', (done) => {
      const switchPage = spy(() => Promise.resolve());
      flux().page = <any>{ switchPage };
      tag().emitEvent = () => {
        expect(switchPage).to.have.been.calledWith(8);
        done();
      };

      tag().switchPage(<any>{ target: { text: '8' } });
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
