import { DEFAULT_CONFIG, InfiniteScroll, MIN_REQUEST_SIZE } from '../../../src/tags/infinite-scroll/gb-infinite-scroll';
import * as renderer from '../../../src/tags/infinite-scroll/renderer';
import { WINDOW } from '../../../src/utils/common';
import suite from './_suite';
import { expect } from 'chai';
import { Events, Query } from 'groupby-api';

suite('gb-infinite-scroll', InfiniteScroll, ({
  flux, tag, spy, stub,
  expectSubscriptions,
  itShouldConfigure
}) => {

  describe('init()', () => {
    const SCROLLER: any = { addEventListener: () => null };

    beforeEach(() => {
      tag().scroller = SCROLLER;
      tag().onResize = () => null;
      tag().reset = () => null;
    });

    itShouldConfigure(DEFAULT_CONFIG);

    it('should listen for scroll events on scroller', () => {
      const addEventListener = spy();
      tag().scroller = <any>{ addEventListener };

      tag().init();

      expect(addEventListener.calledWith('scroll', tag().onScroll)).to.be.true;
    });

    it('should listen for resize events on window', () => {
      const addEventListener = stub(WINDOW, 'addEventListener');
      tag().scroller = <any>{ addEventListener };

      tag().init();

      expect(addEventListener).to.have.been.calledWith('resize', tag().onResize);
    });

    it('should call reset() for events', () => {
      expectSubscriptions(() => tag().init(), {
        [Events.QUERY_CHANGED]: tag().reset,
        [Events.REFINEMENTS_CHANGED]: tag().reset,
        [Events.COLLECTION_CHANGED]: tag().reset,
        [Events.SORT]: tag().reset
      });
    });

    it('should set initial values', () => {
      tag().init();

      expect(tag().items).to.eql([]);
      expect(tag().loadedItems).to.eq(0);
      expect(tag().runwayEnd).to.eq(0);
    });

    it('should call onResize()', (done) => {
      tag().onResize = () => done();

      tag().init();
    });
  });

  describe('reset()', () => {
    it('should reset values and call attachRenderer()', () => {
      tag().scroller = <any>{ hasChildNodes: () => false };
      tag().items = <any[]>['a', 'b'];
      tag().loadedItems = 3;
      tag().runwayEnd = 100;
      tag().anchorScrollTop = 20;
      tag().oldScroll = 100;
      const attachRenderer = tag().attachRenderer = spy();

      tag().reset();

      expect(tag().items).to.eql([]);
      expect(tag().loadedItems).to.eq(0);
      expect(tag().runwayEnd).to.eq(0);
      expect(tag().anchorScrollTop).to.eq(0);
      expect(tag().oldScroll).to.eq(0);
      expect(attachRenderer).to.be.called;
    });

    it('should remove nodes from scroller', () => {
      const lastChild = { a: 'b' };
      const removeChild = spy();
      const hasChildNodes = stub();
      hasChildNodes.onFirstCall().returns(true);
      hasChildNodes.onSecondCall().returns(true);
      hasChildNodes.onThirdCall().returns(true);
      tag().scroller = <any>{ removeChild, lastChild, hasChildNodes };
      tag().attachRenderer = () => null;

      tag().reset();

      expect(removeChild).to.have.been.calledThrice;
      expect(removeChild).to.have.always.been.calledWith(lastChild);
    });
  });

  describe('onResize()', () => {
    const TAG = { unmount: () => null };
    const SCROLLER: any = { appendChild: () => null };

    beforeEach(() => {
      stub(tag(), 'attachRenderer');
    });

    it('should add and remove tombstone from DOM', (done) => {
      const unmount = spy();
      const structure = { a: 'b' };
      const node = {
        offsetWidth: 1,
        offsetHeight: 13,
        _tag: { unmount }
      };
      const appendChild = spy();
      const createTombstone = stub(renderer.Renderer, 'createTombstone').resolves(node);
      tag().config = { structure };
      tag().scroller = <any>{ appendChild };
      tag().items = [];

      tag().onResize()
        .then(() => {
          expect(appendChild).to.have.been.calledWith(node);
          expect(unmount).to.have.been.called;
          expect(createTombstone).to.have.been.calledWith(structure);
          done();
        });
    });

    it('should set the height & width of a tombstone', (done) => {
      const node = {
        offsetHeight: 10,
        offsetWidth: 11,
        _tag: TAG
      };
      tag().scroller = SCROLLER;
      tag().items = [];
      stub(renderer.Renderer, 'createTombstone').resolves(node);

      tag().onResize()
        .then(() => {
          expect(tag().tombstoneLayout).to.eql({ height: 10, width: 11 });
          done();
        });
    });

    it('should clear the height and width of items', (done) => {
      tag().scroller = SCROLLER;
      tag().items = <any>[
        { height: 1, width: 2 },
        { height: 11, width: 20 },
        { height: 21, width: 12 }
      ];
      stub(renderer.Renderer, 'createTombstone').resolves({ _tag: TAG });

      tag().onResize()
        .then(() => {
          expect(tag().items).to.have.length(3);
          tag().items.forEach((item) => {
            expect(item.height).to.eq(0);
            expect(item.width).to.eq(0);
          });
          done();
        });
    });

    it('should call attachRenderer()', (done) => {
      tag().scroller = SCROLLER;
      tag().items = [];
      tag().attachRenderer = () => done();
      stub(renderer.Renderer, 'createTombstone').resolves({ _tag: TAG });

      tag().onResize();
    });
  });

  describe('onScroll()', () => {
    it('should set oldScroll equal to scroller.scrollTop and call attachRenderer()', () => {
      tag().oldScroll = 1;
      tag().scroller = <any>{ scrollTop: 10 };
      const attachRenderer = tag().attachRenderer = spy();

      tag().onScroll();

      expect(tag().oldScroll).to.eq(10);
      expect(attachRenderer).to.be.called;
    });

    it('should set oldScroll equal to scroller.scrollTop and not call attachRenderer()', () => {
      tag().oldScroll = 10;
      tag().scroller = <any>{ scrollTop: 10 };
      const attachRenderer = tag().attachRenderer = spy();

      tag().onScroll();

      expect(tag().oldScroll).to.eq(10);
      expect(attachRenderer).to.not.be.called;
    });
  });

  describe('attachRenderer()', () => {
    it('should create a Renderer and call attachToView()', () => {
      const attachToView = spy();
      const rendererStub = stub(renderer, 'Renderer').returns({ attachToView });

      tag().attachRenderer();

      expect(rendererStub).to.have.been.calledWith(tag());
      expect(attachToView).to.have.been.called;
    });
  });

  describe('maybeRequestContent()', () => {
    it('should return if request in progress', () => {
      tag().updating = true;
      tag().fetch = (): any => expect.fail();

      tag().maybeRequestContent(<any>{ lastItem: 1 });
    });

    it('should return if no items needed', () => {
      tag().loadedItems = 10;
      tag().fetch = (): any => expect.fail();

      tag().maybeRequestContent(<any>{ lastItem: 10 });
    });

    it('should fetch if no request in progress', (done) => {
      const fetch = stub(tag(), 'fetch').resolves();
      tag().updateItems = () => {
        expect(tag().updating).to.be.true;
        expect(fetch).to.have.been.called;
        done();
      };

      tag().maybeRequestContent(<any>{ lastItem: 1 });
    });

    it('should fetch the correct number of records', (done) => {
      tag().loadedItems = 3;
      tag().fetch = (itemsNeeded): any => {
        expect(itemsNeeded).to.eq(7);
        done();
      };

      tag().maybeRequestContent(<any>{ lastItem: 10 });
    });

    it('should call updateItems() with the fetched records', (done) => {
      const records = [{ a: 'b' }, { c: 'd' }];
      const renderer: any = { lastItem: 1 };
      tag().loadedItems = 0;
      tag().fetch = (): any => Promise.resolve(records);
      tag().updateItems = (newRecords, currRenderer) => {
        expect(newRecords).to.eq(records);
        expect(currRenderer).to.eq(renderer);
        done();
      };

      tag().maybeRequestContent(renderer);
    });
  });

  describe('fetch()', () => {
    it('should get requested number of records', () => {
      const search = stub(flux().bridge, 'search').resolves();
      flux().query = new Query('shoes')
        .withSelectedRefinements({ navigationName: 'brand', type: 'Value', value: 'Nike' })
        .withPageSize(14);
      tag().loadedItems = 28;

      tag().fetch(50);

      expect(search).to.have.been.calledWithMatch({ pageSize: 50, skip: 28 });
    });

    it('should get the default minimum number of records', () => {
      const search = stub(flux().bridge, 'search').resolves();

      tag().fetch(1);

      expect(search.firstCall.args[0].pageSize).to.eq(MIN_REQUEST_SIZE);
    });

    it('should return records', (done) => {
      const item1 = { a: 'b' };
      const item2 = { c: 'd' };
      stub(flux().bridge, 'search').resolves({ records: [item1, item2] });

      tag().fetch(40)
        .then((records) => {
          expect(records[0]).to.eq(item1);
          expect(records[1]).to.eq(item2);
          done();
        });
    });
  });

  describe('updateItems()', () => {
    it('should set updating to false', () => {
      tag().updating = true;
      const renderer: any = { attachToView: () => null };

      tag().updateItems([], renderer);

      expect(tag().updating).to.be.false;
    });

    it('should call addItem() until there are enough items', () => {
      const addItem = stub(tag(), 'addBlankItem', () => tag().items.push(<any>{}));
      const attachToView = spy();
      const renderer: any = { attachToView };
      tag().items = <any[]>[{}, {}, {}];
      tag().loadedItems = 3;

      tag().updateItems(<any[]>[{}, {}, {}, {}, {}], renderer);

      expect(tag().items).to.have.length(8);
      expect(tag().items[1]).to.eql({});
      expect(tag().items[5].data).to.eql({});
      expect(addItem).to.have.callCount(5);
      expect(attachToView).to.have.been.called;
    });
  });

  describe('addBlankItem()', () => {
    it('should add a blank item to items', () => {
      tag().items = <any[]>[{}, {}, {}];

      tag().addBlankItem();

      expect(tag().items).to.have.length(4);
      expect(tag().items[3]).to.eql({ data: null, node: null, height: 0, width: 0, top: 0 });
    });
  });
});
