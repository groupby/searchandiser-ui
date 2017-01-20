import { Renderer } from '../../../src/tags/infinite-scroll/renderer';
import { expect } from 'chai';
import * as riot from 'riot';

describe('gb-infinite-scroll renderer', () => {
  let sandbox: Sinon.SinonSandbox;
  let calculateVisibleItems: Sinon.SinonStub;
  let initAnchorScrollTop: Sinon.SinonStub;
  let renderer: Renderer;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    calculateVisibleItems = sandbox.stub(Renderer.prototype, 'calculateVisibleItems');
    initAnchorScrollTop = sandbox.stub(Renderer.prototype, 'initAnchorScrollTop');
    renderer = new Renderer(<any>{ refs: { scroller: {} }, tombstoneLayout: {} });
  });
  afterEach(() => sandbox.restore());

  describe('on construction', () => {
    it('should set tag', () => {
      const tag: any = { refs: { scroller: {} }, tombstoneLayout: {} };

      renderer = new Renderer(tag);

      expect(renderer.tag).to.eq(tag);
    });

    it('should call calculateVisibleItems()', () => {
      expect(calculateVisibleItems).to.have.been.called;
    });

    it('should call initAnchorScrollTop()', () => {
      expect(initAnchorScrollTop).to.have.been.called;
    });

    it('should set tombstoneHeight & tombstoneWidth', () => {
      const tag: any = {
        refs: { scroller: {} },
        tombstoneLayout: {
          height: 13,
          width: 15
        }
      };

      renderer = new Renderer(tag);

      expect(renderer.tombstoneHeight).to.eq(13);
      expect(renderer.tombstoneWidth).to.eq(15);
    });
  });

  describe('initAnchorScrollTop()', () => {
    beforeEach(() => initAnchorScrollTop.restore());

    it('should reset anchor if at top', () => {
      renderer.tag = <any>{ refs: { scroller: { scrollTop: 0 } } };
      renderer.getAnchoredItem = () => null;

      renderer.initAnchorScrollTop(10);

      expect(renderer.tag.anchor).to.eql({ index: 0, offset: 0 });
    });

    it('should get new anchor item if not at top', () => {
      const newAnchor = { a: 'b' };
      const anchor = renderer.tag.anchor = <any>{ c: 'd' };
      const getAnchoredItem = sandbox.stub(renderer, 'getAnchoredItem').returns(newAnchor);
      renderer.tag.refs.scroller = <any>{ scrollTop: 12 };
      renderer.tag.anchorScrollTop = 5;

      renderer.initAnchorScrollTop(7);

      expect(renderer.tag.anchor).to.eq(newAnchor);
      expect(getAnchoredItem).to.have.been.calledWith(anchor, 7);
    });

    it('should calculate new anchorScrollTop', () => {
      renderer.getAnchoredItem = () => null;
      renderer.tag.refs.scroller = <any>{ scrollTop: 12 };
      renderer.tag.anchorScrollTop = 5;

      renderer.initAnchorScrollTop(10);

      expect(renderer.tag.anchorScrollTop).to.eq(12);
    });
  });

  describe('calculateVisibleItems()', () => {
    beforeEach(() => {
      calculateVisibleItems.restore();
      renderer.tag.capRecords = (val) => val;
    });

    it('should calculate view boundaries when delta < 0', () => {
      const getAnchoredItem = renderer.getAnchoredItem = sinon.spy(() => ({ index: 40 }));
      const anchor = renderer.tag.anchor = <any>{ index: 56 };
      renderer.tag.refs.scroller = <any>{ offsetHeight: 20 };

      renderer.calculateVisibleItems(-15);

      expect(renderer.firstItem).to.eq(6);
      expect(renderer.lastItem).to.eq(50);
      expect(getAnchoredItem).to.have.been.calledWith(anchor, 20);
    });

    it('should create a view boundaries when delta > 0', () => {
      const getAnchoredItem = renderer.getAnchoredItem = sinon.spy(() => ({ index: 14 }));
      const anchor = renderer.tag.anchor = <any>{ index: 12 };
      renderer.tag.refs.scroller = <any>{ offsetHeight: 39 };

      renderer.calculateVisibleItems(30);

      expect(renderer.firstItem).to.eq(2);
      expect(renderer.lastItem).to.eq(64);
      expect(getAnchoredItem).to.have.been.calledWith(anchor, 39);
    });

    it('first item cannot be lower than 0', () => {
      renderer.getAnchoredItem = () => (<any>{ index: 6 });
      renderer.tag.anchor = <any>{ index: 2 };
      renderer.tag.refs.scroller = <any>{ offsetHeight: 20 };

      renderer.calculateVisibleItems(-10);

      expect(renderer.firstItem).to.eq(0);
    });

    it('should call tag.capRecords()', () => {
      const capRecords = renderer.tag.capRecords = sinon.spy();
      renderer.getAnchoredItem = () => (<any>{ index: 6 });
      renderer.tag.anchor = <any>{};

      renderer.calculateVisibleItems(-10);

      expect(capRecords).to.have.been.calledWith(16);
    });
  });

  describe('getAnchoredItem()', () => {
    it('should return original anchor if delta is 0', () => {
      const anchor: any = { a: 'b' };

      expect(renderer.getAnchoredItem(anchor, 0)).to.eq(anchor);
    });

    describe('delta < 0', () => {
      it('should return top item', () => {
        const anchor = { index: 2, offset: 12 };
        renderer.tag.items = <any[]>[{ height: 4 }, { height: 12 }, { height: 30 }];
        Object.assign(renderer, { tombstoneHeight: 30, tombstoneWidth: 3 });

        const newAnchor = renderer.getAnchoredItem(anchor, -25);

        expect(newAnchor).to.eql({ index: 0, offset: 3 });
      });
    });

    describe('delta > 0', () => {
      it('should return last item', () => {
        const anchor = { index: 0, offset: 12 };
        renderer.tag.items = <any[]>[{ height: 42 }, { height: 12 }, { height: 30 }];
        Object.assign(renderer, { tombstoneHeight: 30, tombstoneWidth: 3 });

        const newAnchor = renderer.getAnchoredItem(anchor, 43);

        expect(newAnchor).to.eql({ index: 2, offset: 1 });
      });

      it('should return a tombstone when scrolled past rendered items', () => {
        const anchor = { index: 0, offset: 12 };
        renderer.tag.items = <any[]>[{ height: 42 }, {}, {}, {}];
        Object.assign(renderer, { tombstoneHeight: 30, tombstoneWidth: 3 });

        const newAnchor = renderer.getAnchoredItem(anchor, 61);

        expect(newAnchor).to.eql({ index: 2, offset: 1 });
      });

      it('should return a tombstone when current anchor has no height', () => {
        const anchor = { index: 1, offset: 12 };
        renderer.tag.items = <any[]>[];
        Object.assign(renderer, { tombstoneHeight: 30, tombstoneWidth: 3 });

        const newAnchor = renderer.getAnchoredItem(anchor, 55);

        expect(newAnchor).to.eql({ index: 3, offset: 7 });
      });
    });
  });

  describe('attachToView()', () => {
    it('should call findUnusedNodes()', (done) => {
      renderer.findUnusedNodes = () => done();

      renderer.attachToView();
    });

    it('should call generateNodes()', (done) => {
      renderer.findUnusedNodes = () => null;
      renderer.generateNodes = () => done();

      renderer.attachToView();
    });

    it('should call dropUnusedNodes()', (done) => {
      renderer.findUnusedNodes = () => null;
      renderer.generateNodes = () => ({});
      renderer.dropUnusedNodes = () => done();

      renderer.attachToView();
    });

    it('should call measureNodes()', (done) => {
      renderer.findUnusedNodes = () => null;
      renderer.generateNodes = () => ({});
      renderer.dropUnusedNodes = () => null;
      renderer.measureNodes = () => done();

      renderer.attachToView();
    });

    it('should call calculateScrollTop()', (done) => {
      renderer.findUnusedNodes = () => null;
      renderer.generateNodes = () => ({});
      renderer.dropUnusedNodes = () => null;
      renderer.measureNodes = () => null;
      renderer.calculateScrollTop = () => done();

      renderer.attachToView();
    });

    it('should call calculateCurrentPosition()', (done) => {
      renderer.findUnusedNodes = () => null;
      renderer.generateNodes = () => ({});
      renderer.dropUnusedNodes = () => null;
      renderer.measureNodes = () => null;
      renderer.calculateScrollTop = () => null;
      renderer.calculateCurrentPosition = () => done();

      renderer.attachToView();
    });

    it('should call preAnimateNodes()', (done) => {
      renderer.findUnusedNodes = () => null;
      renderer.generateNodes = () => ({});
      renderer.dropUnusedNodes = () => null;
      renderer.measureNodes = () => null;
      renderer.calculateScrollTop = () => null;
      renderer.calculateCurrentPosition = () => null;
      renderer.preAnimateNodes = () => done();

      renderer.attachToView();
    });

    it('should call animateNodes()', (done) => {
      renderer.findUnusedNodes = () => null;
      renderer.generateNodes = () => ({});
      renderer.dropUnusedNodes = () => null;
      renderer.measureNodes = () => null;
      renderer.calculateScrollTop = () => null;
      renderer.calculateCurrentPosition = () => null;
      renderer.preAnimateNodes = () => null;
      renderer.animateNodes = () => done();

      renderer.attachToView();
    });

    it('should call animateScroller()', (done) => {
      renderer.findUnusedNodes = () => null;
      renderer.generateNodes = () => ({});
      renderer.dropUnusedNodes = () => null;
      renderer.measureNodes = () => null;
      renderer.calculateScrollTop = () => null;
      renderer.calculateCurrentPosition = () => null;
      renderer.preAnimateNodes = () => null;
      renderer.animateNodes = () => null;
      renderer.animateScroller = () => done();

      renderer.attachToView();
    });

    it('should call collectTombstones()', (done) => {
      renderer.findUnusedNodes = () => null;
      renderer.generateNodes = () => ({});
      renderer.dropUnusedNodes = () => null;
      renderer.measureNodes = () => null;
      renderer.calculateScrollTop = () => null;
      renderer.calculateCurrentPosition = () => null;
      renderer.preAnimateNodes = () => null;
      renderer.animateNodes = () => null;
      renderer.animateScroller = () => null;
      renderer.collectTombstones = () => done();

      renderer.attachToView();
    });

    it('should call maybeRequestContent()', (done) => {
      renderer.findUnusedNodes = () => null;
      renderer.generateNodes = () => ({});
      renderer.dropUnusedNodes = () => null;
      renderer.measureNodes = () => null;
      renderer.calculateScrollTop = () => null;
      renderer.calculateCurrentPosition = () => null;
      renderer.preAnimateNodes = () => null;
      renderer.animateNodes = () => null;
      renderer.animateScroller = () => null;
      renderer.collectTombstones = () => null;
      renderer.tag.maybeRequestContent = () => done();

      renderer.attachToView();
    });
  });

  describe('findUnusedNodes()', () => {
    it('should call sortNode() for each non-visible node', () => {
      const sortNode = sandbox.stub(renderer, 'sortNode');
      renderer.tag = <any>{ items: [{ node: 1 }, { node: 2 }, { node: 3 }, {}, { node: 4 }] };
      renderer.firstItem = 2;
      renderer.lastItem = 3;

      renderer.findUnusedNodes();

      expect(sortNode).to.have.been.calledThrice;
    });

    it('should not call sortNode() for visible nodes', () => {
      const sortNode = sandbox.stub(renderer, 'sortNode');
      renderer.tag = <any>{ items: [{ node: 10 }, { node: 5 }, {}, { node: 1 }, { node: 3 }] };
      renderer.firstItem = 0;
      renderer.lastItem = 2;

      renderer.findUnusedNodes();

      expect(sortNode).to.have.been.calledTwice;
    });

    it('should clear non-visible nodes', () => {
      const items = <any[]>[{ node: 10 }, { node: 5 }, {}, { node: 1 }, { node: 3 }];
      renderer.tag = <any>{ items };
      renderer.firstItem = 0;
      renderer.lastItem = 2;
      sandbox.stub(renderer, 'sortNode');

      renderer.findUnusedNodes();

      expect(items.map((item) => item.node)).to.eql([10, 5, null, null, null]);
    });
  });

  describe('sortNode()', () => {
    it('should add to tombstones list and set invisible', () => {
      const contains = sandbox.spy(() => true);
      const add = sandbox.spy();
      const node: any = { classList: { contains, add } };

      renderer.sortNode(node);

      expect(renderer.tombstones).to.eql([node]);
      expect(contains).to.have.been.calledWith('tombstone');
      expect(add).to.have.been.calledWith('invisible');
    });

    it('should add to unusedNodes', () => {
      const contains = sandbox.spy(() => false);
      const node: any = { classList: { contains } };

      renderer.sortNode(node);

      expect(renderer.unusedNodes).to.eql([node]);
      expect(contains).to.have.been.calledWith('tombstone');
    });
  });

  describe('generateNodes()', () => {
    const SCROLLER = { appendChild: () => null };

    beforeEach(() => {
      renderer.firstItem = 0;
      renderer.lastItem = 4;
    });

    it('should call addBlankItem() for each item in items + 1', () => {
      const addBlankItem = sinon.spy(() => renderer.tag.items.push(<any>{}));
      renderer.tag = <any>{ items: [{}, {}], refs: { scroller: SCROLLER }, addBlankItem };
      sandbox.stub(renderer, 'getTombstone').returns({ style: {} });

      renderer.generateNodes();

      expect(addBlankItem).to.have.been.calledTwice;
    });

    it('should animate tombstones for items > items + 1', () => {
      const contains = sinon.spy(() => true);
      const node1 = { classList: { contains }, style: <any>{} };
      const item1 = { node: node1, top: 30, data: 1 };
      const node2 = { classList: { contains }, style: <any>{} };
      const item2 = { node: node2, top: 46, data: 1 };
      renderer.tag = <any>{
        anchorScrollTop: 20,
        items: [{}, {}, item1, item2],
        refs: { scroller: SCROLLER }
      };
      sandbox.stub(renderer, 'getTombstone').returns({ style: {} });
      sandbox.stub(renderer, 'render').returns({ style: {} });

      const nodes = renderer.generateNodes();

      expect(nodes).to.eql({
        2: { node: node1, delta: 10 },
        3: { node: node2, delta: 26 }
      });
      expect(item1.node).to.not.eq(node1);
      expect(item2.node).to.not.eq(node2);
      expect(node1.style.zIndex).to.eq('1');
      expect(node2.style.zIndex).to.eq('1');
      expect(contains).to.have.been.calledTwice;
      expect(contains).to.always.have.been.calledWith('tombstone');
    });

    it('should not animate non-tombstones', () => {
      const contains = sinon.spy(() => false);
      const node = { classList: { contains }, style: <any>{} };
      const item = { node, top: 30, data: 1 };
      renderer.tag = <any>{
        anchorScrollTop: 20,
        items: [{}, {}, {}, item],
        refs: { scroller: SCROLLER }
      };
      sandbox.stub(renderer, 'getTombstone').returns({ style: {} });

      const nodes = renderer.generateNodes();

      expect(contains).to.have.been.calledWith('tombstone');
      expect(nodes).to.eql({});
    });

    it('should render and style items and tombstones', () => {
      const items: any[] = [{}, {}, { data: 1 }, { data: 2 }];
      const appendChild = sinon.spy();
      const getTombstone = sandbox.stub(renderer, 'getTombstone').returns({ a: 'b', style: {} });
      const render = sandbox.stub(renderer, 'render').returns({ c: 'd', style: {} });
      const unused1 = { e: 'f' };
      const unused2 = { g: 'h' };
      renderer.tag = <any>{ items, refs: { scroller: { appendChild } }, anchorScrollTop: 20 };
      renderer.unusedNodes = <any[]>[unused2, unused1];

      renderer.generateNodes();

      expect(items).to.have.length(4);
      items.slice(0, 2).forEach((item) => expect(item.node).to.eql({ a: 'b', style: { position: 'absolute' } }));
      items.slice(2).forEach((item) => expect(item.node).to.eql({ c: 'd', style: { position: 'absolute' } }));
      items.forEach((item) => {
        expect(item.top).to.eq(-1);
        expect(appendChild).to.have.been.calledWith(item.node);
      });
      expect(getTombstone).to.have.been.calledTwice;
      expect(render).to.have.been.calledTwice;
      expect(render).to.have.been.calledWith(1, unused1);
      expect(render).to.have.been.calledWith(2, unused2);
    });
  });

  describe('getTombstone()', () => {
    it('should remove class invisible and transform style', () => {
      const remove = sinon.spy();
      renderer.tombstones = <any[]>[{ classList: { remove }, style: {} }];

      const tombstone = renderer.getTombstone();

      expect(tombstone.style.opacity).to.eq(undefined);
      expect(tombstone.style.transform).to.eq('');
      expect(tombstone.style.transition).to.eq('');
      expect(remove).to.have.been.calledWith('invisible');
    });

    it('should call createTombstone() if no tombstones exist', () => {
      const newTombstone = { a: 'b' };
      const structure = { c: 'd' };
      const createTombstone = sandbox.stub(Renderer, 'createTombstone').returns(newTombstone);
      renderer.tag = <any>{ config: { structure } };

      const tombstone = renderer.getTombstone();

      expect(tombstone).to.eq(newTombstone);
      expect(createTombstone).to.have.been.calledWith(structure);
    });
  });

  describe('render()', () => {
    it('should update content on existing node', () => {
      const record = { allMeta: { a: 'b' } };
      const update = sinon.spy();
      const node: any = { _tag: { update, opts: {} } };

      renderer.render(record, node);

      expect(node._tag.opts.allMeta).to.eq(record.allMeta);
      expect(update).to.have.been.called;
    });

    it('should update content on new node', () => {
      const record = { allMeta: { a: 'b' } };
      const structure = { c: 'd' };
      const remove = sinon.spy();
      const update = sinon.spy();
      const opts: any = {};
      const createTombstone = sandbox.stub(Renderer, 'createTombstone').returns({
        _tag: { update, opts },
        classList: { remove }
      });
      renderer.tag = <any>{ config: { structure } };

      renderer.render(record, null);

      expect(opts.allMeta).to.eq(record.allMeta);
      expect(remove).to.have.been.calledWith('tombstone');
      expect(update).to.have.been.called;
      expect(createTombstone).to.have.been.calledWith(structure);
    });
  });

  describe('dropUnusedNodes()', () => {
    it('should remove all remaining unused nodes from scroller', () => {
      const node1 = { a: 'b' };
      const node2 = { a: 'b' };
      const node3 = { a: 'b' };
      const removeChild = sinon.spy();
      renderer.tag = <any>{ refs: { scroller: { removeChild } } };
      renderer.unusedNodes = <any[]>[node3, node2, node1];

      renderer.dropUnusedNodes();

      expect(renderer.unusedNodes).to.eql([]);
      expect(removeChild).to.have.been.calledThrice;
      expect(removeChild.firstCall).to.have.been.calledWith(node1);
      expect(removeChild.secondCall).to.have.been.calledWith(node2);
      expect(removeChild.thirdCall).to.have.been.calledWith(node3);
    });
  });

  describe('measureNodes()', () => {
    it('should measure all nodes with real data and no height', () => {
      const dataItem: any = { data: {}, node: { offsetHeight: 42, offsetWidth: 9 } };
      renderer.tag.items = [{}, {}, dataItem, { data: {}, height: 4 }, { height: 12 }, {}, {}];

      renderer.measureNodes();

      expect(dataItem.height).to.eq(42);
      expect(dataItem.width).to.eq(9);
    });
  });

  describe('calculateScrollTop()', () => {
    it('should sum the heights of every visible item', () => {
      const items: any = [{}, {}, { height: 23 }, { height: 41 }, {}];
      renderer.tombstoneHeight = 14;
      renderer.tag = <any>{ items, anchorScrollTop: 10, anchor: { index: 4, offset: 13 } };

      renderer.calculateScrollTop();

      expect(renderer.tag.anchorScrollTop).to.eq(105);
    });
  });

  describe('calculateCurrentPosition()', () => {
    it('should calculate current position if anchor before first item', () => {
      const items = [{}, {}, { height: 27 }, {}];
      const anchor = { index: 2, offset: 29 };
      renderer.tombstoneHeight = 28;
      renderer.tag = <any>{ items, anchor, anchorScrollTop: 12 };
      renderer.firstItem = 4;

      renderer.calculateCurrentPosition();

      expect(renderer.currentPosition).to.eq(38);
    });

    it('should calculate current position if anchor after first item', () => {
      const items = [{}, {}, { height: 27 }, { height: 12 }];
      const anchor = { index: 4, offset: 29 };
      renderer.tombstoneHeight = 28;
      renderer.tag = <any>{ items, anchor, anchorScrollTop: 108 };
      renderer.firstItem = 1;

      renderer.calculateCurrentPosition();

      expect(renderer.currentPosition).to.eq(12);
    });
  });

  describe('preAnimateNodes()', () => {
    it('should style nodes', () => {
      const node1: any = { style: {} };
      const node2: any = { style: {} };
      const items = [
        {},
        { node: node1, height: 14, width: 31 },
        { node: node2, height: 9, width: 13 }
      ];
      Object.assign(renderer, { tombstoneHeight: 17, tombstoneWidth: 19 });
      renderer.tag = <any>{ items, anchorScrollTop: 21 };

      renderer.preAnimateNodes(<any>{
        1: { node: {}, delta: 40 },
        2: { node: {}, delta: 10 }
      });

      expect(node1.style.transform).to.eq('translateY(61px) scale(0.6129032258064516, 1.2142857142857142)');
      expect(node1.style.transition).to.eq('transform 200ms');
      expect(node2.style.transform).to.eq('translateY(31px) scale(1.4615384615384615, 1.8888888888888888)');
      expect(node2.style.transition).to.eq('transform 200ms');
    });

    it('should force nodes to be re-drawn', () => {
      let nodesRedrawn = 0;
      const node1: any = { style: {}, get offsetTop() { return nodesRedrawn++; } };
      const node2: any = { style: {}, get offsetTop() { return nodesRedrawn++; } };
      const items = [{}, { node: node1 }, { node: node2 }];
      const animNode1 = { get offsetTop() { return nodesRedrawn++; } };
      const animNode2 = { get offsetTop() { return nodesRedrawn++; } };
      renderer.tag = <any>{ items, tombstoneLayout: {} };

      renderer.preAnimateNodes(<any>{ 1: { node: animNode1 }, 2: { node: animNode2 } });

      expect(nodesRedrawn).to.eq(4);
    });
  });

  describe('animateNodes()', () => {
    it('should apply existing animations', () => {
      const animNode1: any = { style: {} };
      const animNode2: any = { style: {} };
      const item1 = { node: { style: {} } };
      const item2 = { height: 23, width: 14, node: { style: {} } };
      const item3 = { height: 13, width: 39, node: { style: {} } };
      const items = [{}, item1, item2, item3];
      Object.assign(renderer, { tombstoneHeight: 14, tombstoneWidth: 13 });
      renderer.tag = <any>{ items };
      renderer.firstItem = 1;
      renderer.lastItem = 4;
      renderer.currentPosition = 132;

      renderer.animateNodes(<any>{ 2: { node: animNode1 }, 3: { node: animNode2 } });

      expect(animNode1.style.transition).to.eq('transform 200ms, opacity 200ms');
      expect(animNode1.style.transform).to.eq('translateY(146px) scale(1.0769230769230769, 1.6428571428571428)');
      expect(animNode1.style.opacity).to.eq('0');
      expect(animNode2.style.transition).to.eq('transform 200ms, opacity 200ms');
      expect(animNode2.style.transform).to.eq('translateY(169px) scale(3, 0.9285714285714286)');
      expect(animNode2.style.opacity).to.eq('0');
    });

    it('should apply animations to items that need to be offset', () => {
      const node1 = { style: {} };
      const node2: any = { style: {} };
      const items = [{}, { node: node1, top: 100 }, { node: node2 }];
      Object.assign(renderer, { tombstoneHeight: 14, tombstoneWidth: 13 });
      renderer.tag = <any>{ items };
      renderer.firstItem = 1;
      renderer.lastItem = 3;
      renderer.currentPosition = 100;

      renderer.animateNodes({});

      expect(node1.style).to.eql({});
      expect(node2.style.transform).to.eq('translateY(114px)');
    });

    it('should apply skip transition on item if no animation exists', () => {
      const node1: any = { style: {} };
      const node2 = { style: {} };
      const items = [{}, { node: node1 }, { node: node2 }];
      renderer.tag = <any>{ items };
      renderer.firstItem = 1;
      renderer.lastItem = 3;
      renderer.currentPosition = 100;

      renderer.animateNodes(<any>{ 2: { node: { style: {} } } });

      expect(node1.style.transition).to.eq('');
      expect(node2.style).to.not.have.property('transition');
    });

    it('should set the item offset and update currentPosition', () => {
      const item1 = { node: { style: {} }, top: 19, height: 31 };
      const item2 = { node: { style: {} }, top: 43, height: 25 };
      const items = [{}, item1, item2];
      renderer.tag = <any>{ items };
      renderer.firstItem = 1;
      renderer.lastItem = 3;
      renderer.currentPosition = 100;

      renderer.animateNodes({});

      expect(item1.top).to.eq(100);
      expect(item2.top).to.eq(131);
      expect(renderer.currentPosition).to.eq(156);
    });
  });

  describe('animateScroller()', () => {
    it('should set tag.runwayEnd', () => {
      const runway: any = { style: {} };
      const scroller: any = {};
      renderer.tag = <any>{ refs: { runway, scroller }, anchorScrollTop: 54, runwayEnd: 0 };
      renderer.currentPosition = 34;

      renderer.animateScroller();

      expect(renderer.tag.runwayEnd).to.eq(2034);
      expect(runway.style.transform).to.eq('translate(0, 2034px)');
      expect(scroller.scrollTop).to.eq(54);
    });

    it('should set to previous tag.runwayEnd', () => {
      renderer.tag = <any>{
        refs: {
          runway: { style: {} },
          scroller: {}
        },
        anchorScrollTop: 54,
        runwayEnd: 3000
      };
      renderer.currentPosition = 34;

      renderer.animateScroller();

      expect(renderer.tag.runwayEnd).to.eq(3000);
    });
  });

  describe('collectTombstones()', () => {
    it('should setTimeout()', (done) => {
      const add = sinon.spy();
      const animNode1 = { classList: { add } };
      const animNode2 = { classList: { add } };

      renderer.collectTombstones(<any>{ 1: { node: animNode1 }, 2: { node: animNode2 } });

      setTimeout(() => {
        expect(renderer.tombstones).to.have.length(2);
        expect(renderer.tombstones[1]).to.eq(animNode2);
        expect(add).to.have.been.calledTwice;
        expect(add).to.always.have.been.calledWith('invisible');
        done();
      }, 300);
    });
  });

  describe('static', () => {
    describe('createTombstone()', () => {
      it('should create a tombstone', () => {
        const structure = { a: 'b' };
        const add = sinon.spy();
        const node = { classList: { add } };
        const createElement = sandbox.stub(document, 'createElement').returns(node);
        const mount = sandbox.stub(riot, 'mount');

        const elem = Renderer.createTombstone(structure);

        expect(elem).to.eq(node);
        expect(createElement).to.have.been.calledWith('li');
        expect(mount).to.have.been.calledWith(node, 'gb-product', {
          structure,
          tombstone: true,
          infinite: true
        });
      });
    });
  });
});
