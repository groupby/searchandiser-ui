import { SESSION_COOKIE_KEY, Tracker, VISITOR_COOKIE_KEY } from '../../../src/services/tracker';
import { expect } from 'chai';
import * as GbTracker from 'gb-tracker-client';
import { Events } from 'groupby-api';
import * as Cookies from 'js-cookie';

const TEST_CONFIG: any = {
  customerId: 'test',
  area: 'other'
};

describe('tracker service', () => {
  let sandbox: Sinon.SinonSandbox;
  let trackerService: Tracker;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    trackerService = new Tracker(<any>{ on: () => null }, TEST_CONFIG);
  });
  afterEach(() => sandbox.restore());

  describe('on constuction', () => {
    it('should have default values', () => {
      trackerService = new Tracker(<any>{}, TEST_CONFIG);

      expect(trackerService.tracker).to.be.an.instanceof(GbTracker);
      expect(trackerService._config).to.eql({});
    });

    it('should take global tracker config', () => {
      const trackerConfig = { visitorId: 14523, sessionId: 512908 };

      trackerService = new Tracker(<any>{}, Object.assign({ tracker: trackerConfig }, TEST_CONFIG));

      expect(trackerService._config).to.eq(trackerConfig);
    });
  });

  describe('init()', () => {
    it('should set visitor information', (done) => {
      trackerService.setVisitorInfo = () => done();

      trackerService.init();
    });

    it('should set up viewProduct listener', (done) => {
      trackerService.setVisitor = () => null;
      trackerService.listenForViewProduct = () => done();

      trackerService.init();
    });
  });

  describe('setVisitorInfo()', () => {
    it('should use configured ids', () => {
      const visitorId = '1faslkdj';
      const sessionId = 'lk15k3j4';
      const spy = trackerService.setVisitor = sinon.spy((visId, sessId) => {
        expect(visId).to.eq(visitorId);
        expect(sessId).to.eq(sessionId);
      });
      trackerService._config = { visitorId, sessionId };

      trackerService.setVisitorInfo();

      expect(spy.called).to.be.true;
    });

    it('should use cookies', () => {
      const visitorId = '1faslkdj';
      const sessionId = 'lk15k3j4';
      const spy = trackerService.setVisitor = sinon.spy((visId, sessId) => {
        expect(visId).to.eq(visitorId);
        expect(sessId).to.eq(sessionId);
      });
      Cookies.set(VISITOR_COOKIE_KEY, visitorId);
      Cookies.set(SESSION_COOKIE_KEY, sessionId);

      trackerService.setVisitorInfo();

      expect(spy.called).to.be.true;
    });

    it('should generate ids', () => {
      const spy = trackerService.setVisitor = sinon.spy((visId, sessId) => {
        expect(visId).to.be.ok;
        expect(visId).to.length.to.be.greaterThan(1);
        expect(sessId).to.be.ok;
        expect(sessId).to.length.to.be.greaterThan(1);
      });

      trackerService.setVisitorInfo();

      expect(spy.called).to.be.true;
    });

    it('should set cookies', () => {
      let visitorId;
      let sessionId;
      trackerService.setVisitor = (visId, sessId) => {
        visitorId = visId;
        sessionId = sessId;
      };

      trackerService.setVisitorInfo();

      expect(Cookies.get(VISITOR_COOKIE_KEY)).to.eq(visitorId);
      expect(Cookies.get(SESSION_COOKIE_KEY)).to.eq(sessionId);
    });
  });

  describe('setVisitor()', () => {
    it('should call tracker.setVisitor()', () => {
      const visitorId = '149182';
      const sessionId = '151092';
      const setVisitor = sinon.spy((visId, sessId) => {
        expect(visId).to.eq(visitorId);
        expect(sessId).to.eq(sessionId);
      });
      trackerService.tracker = <any>{ setVisitor };

      trackerService.setVisitor(visitorId, sessionId);

      expect(setVisitor.called).to.be.true;
    });
  });

  describe('sendSearchEvent()', () => {
    it('should call tracker.sendSearchEvent()', () => {
      const results = { a: 'b', c: 'd' };
      const flux: any = { results };
      const sendSearchEvent = sinon.spy((event) => expect(event).to.eql({
        search: Object.assign({
          origin: { search: true },
          query: ''
        }, results)
      }));
      trackerService = new Tracker(flux, TEST_CONFIG);
      trackerService.tracker = <any>{ sendSearchEvent };

      trackerService.sendSearchEvent();

      expect(sendSearchEvent.called).to.be.true;
    });

    it('should use originalQuery', () => {
      const originalQuery = 'shoes';
      const results = { originalQuery, a: 'b', c: 'd' };
      const flux: any = { results };
      const sendSearchEvent = sinon.spy((event) => expect(event.search.query).to.eq(originalQuery));
      trackerService = new Tracker(flux, TEST_CONFIG);
      trackerService.tracker = <any>{ sendSearchEvent };

      trackerService.sendSearchEvent();

      expect(sendSearchEvent.called).to.be.true;
    });

    it('should allow overriding the origin', () => {
      const sendSearchEvent = sinon.spy((event) => expect(event.search.origin).to.eql({ dym: true }));
      trackerService = new Tracker(<any>{ results: {} }, TEST_CONFIG);
      trackerService.tracker = <any>{ sendSearchEvent };

      trackerService.sendSearchEvent('dym');

      expect(sendSearchEvent.called).to.be.true;
    });
  });

  describe('listenForViewProduct()', () => {
    it('should listen for details event', () => {
      const spy = sinon.spy((event, cb) => {
        expect(event).to.eq(Events.DETAILS);
        expect(cb).to.be.a('function');
      });
      const flux: any = { on: spy };
      trackerService = new Tracker(flux, TEST_CONFIG);

      trackerService.listenForViewProduct();

      expect(spy.called).to.be.true;
    });

    it('should call tracker.sendViewProductEvent()', () => {
      const record = { allMeta: { id: 125123, shortTitle: 'Shoes', cost: 113.49 } };
      const structure = { title: 'shortTitle', price: 'cost' };
      const flux: any = { on: (event, cb) => cb(record) };
      const sendViewProductEvent = sinon.spy((event) => expect(event).to.eql({
        product: {
          productId: 125123,
          title: 'Shoes',
          price: 113.49,
          category: 'NONE'
        }
      }));
      trackerService = new Tracker(flux, Object.assign({ structure }, TEST_CONFIG));
      trackerService.tracker = <any>{ sendViewProductEvent };

      trackerService.listenForViewProduct();

      expect(sendViewProductEvent.called).to.be.true;
    });
  });

  describe('addToCart()', () => {
    it('should call tracker.sendAddToCartEvent()', () => {
      const event = { a: 'b' };
      const sendAddToCartEvent = sinon.spy((eventObj) => expect(eventObj).to.eq(event));
      trackerService.tracker = <any>{ sendAddToCartEvent };

      trackerService.addToCart(event);

      expect(sendAddToCartEvent.called).to.be.true;
    });
  });

  describe('order()', () => {
    it('should call tracker.sendOrderEvent()', () => {
      const event = { a: 'b' };
      const sendOrderEvent = sinon.spy((eventObj) => expect(eventObj).to.eq(event));
      trackerService.tracker = <any>{ sendOrderEvent };

      trackerService.order(event);

      expect(sendOrderEvent.called).to.be.true;
    });
  });
});
