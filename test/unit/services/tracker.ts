import { SESSION_COOKIE_KEY, Tracker, VISITOR_COOKIE_KEY } from '../../../src/services/tracker';
import { expectSubscriptions } from '../../utils/expectations';
import suite from './_suite';
import { expect } from 'chai';
import * as GbTracker from 'gb-tracker-client';
import { Events } from 'groupby-api';
import * as Cookies from 'js-cookie';

const TEST_CONFIG: any = {
  customerId: 'test',
  area: 'other'
};

suite('tracker', ({ spy, stub }) => {

  describe('on construction', () => {
    it('should have default values', () => {
      const service = new Tracker(<any>{}, TEST_CONFIG);

      expect(service.tracker).to.be.an.instanceof(GbTracker);
      expect(service._config).to.eql({});
    });

    it('should take global tracker config', () => {
      const trackerConfig = { visitorId: 14523, sessionId: 512908 };

      const service = new Tracker(<any>{}, Object.assign({ tracker: trackerConfig }, TEST_CONFIG));

      expect(service._config).to.eq(trackerConfig);
    });
  });

  describe('init()', () => {
    let service: Tracker;

    beforeEach(() => service = new Tracker(<any>{ on: () => null }, TEST_CONFIG));

    it('should set visitor information', (done) => {
      service.setVisitorInfo = () => done();

      service.init();
    });

    it('should set up viewProduct listener', (done) => {
      service.setVisitor = () => null;
      service.listenForViewProduct = () => done();

      service.init();
    });
  });

  describe('setVisitorInfo()', () => {
    let service: Tracker;

    beforeEach(() => service = new Tracker(<any>{ on: () => null }, TEST_CONFIG));

    it('should use configured ids', () => {
      const visitorId = '1faslkdj';
      const sessionId = 'lk15k3j4';
      const setVisitor = stub(service, 'setVisitor');
      service._config = { visitorId, sessionId };

      service.setVisitorInfo();

      expect(setVisitor).to.have.been.calledWith(visitorId, sessionId);
    });

    it('should use cookies', () => {
      const visitorId = '1faslkdj';
      const sessionId = 'lk15k3j4';
      const setVisitor = stub(service, 'setVisitor');
      Cookies.set(VISITOR_COOKIE_KEY, visitorId);
      Cookies.set(SESSION_COOKIE_KEY, sessionId);

      service.setVisitorInfo();

      expect(setVisitor).to.have.been.calledWith(visitorId, sessionId);
    });

    it('should generate ids', () => {
      const setVisitor = stub(service, 'setVisitor', (visId, sessId) => {
        expect(visId).to.be.ok;
        expect(visId).to.have.length.gt(1);
        expect(sessId).to.be.ok;
        expect(sessId).to.have.length.gt(1);
      });

      service.setVisitorInfo();

      expect(setVisitor).to.have.been.called;
    });

    it('should set cookies', () => {
      let visitorId;
      let sessionId;
      service.setVisitor = (visId, sessId) => {
        visitorId = visId;
        sessionId = sessId;
      };

      service.setVisitorInfo();

      expect(Cookies.get(VISITOR_COOKIE_KEY)).to.eq(visitorId);
      expect(Cookies.get(SESSION_COOKIE_KEY)).to.eq(sessionId);
    });
  });

  describe('setVisitor()', () => {
    it('should call tracker.setVisitor()', () => {
      const visitorId = '149182';
      const sessionId = '151092';
      const setVisitor = spy();
      const service = new Tracker(<any>{ on: () => null }, TEST_CONFIG);
      service.tracker = <any>{ setVisitor };

      service.setVisitor(visitorId, sessionId);

      expect(setVisitor).to.have.been.calledWith(visitorId, sessionId);
    });
  });

  describe('sendSearchEvent()', () => {
    it('should call tracker.sendSearchEvent()', () => {
      const results = { a: 'b', c: 'd', records: [] };
      const flux: any = { results };
      const sendSearchEvent = spy();
      const service = new Tracker(flux, TEST_CONFIG);
      service.tracker = <any>{ sendSearchEvent };

      service.sendSearchEvent();

      expect(sendSearchEvent).to.have.been.calledWith({
        search: Object.assign({
          origin: { search: true },
          query: ''
        }, results)
      });
    });

    it('should use originalQuery', () => {
      const originalQuery = 'shoes';
      const results = { originalQuery, records: [], a: 'b', c: 'd' };
      const flux: any = { results };
      const sendSearchEvent = spy();
      const service = new Tracker(flux, TEST_CONFIG);
      service.tracker = <any>{ sendSearchEvent };

      service.sendSearchEvent();

      expect(sendSearchEvent).to.have.been.calledWithMatch({ search: { query: originalQuery } });
    });

    it('should allow overriding the origin', () => {
      const sendSearchEvent = spy();
      const service = new Tracker(<any>{ results: { records: [] } }, TEST_CONFIG);
      service.tracker = <any>{ sendSearchEvent };

      service.sendSearchEvent('dym');

      expect(sendSearchEvent).to.have.been.calledWithMatch({ search: { origin: { dym: true } } });
    });

    it('should remap the record root fields', () => {
      const flux: any = {
        results: {
          records: [{
            id: 12,
            title: 'Big Shoes',
            url: 'http://example.com'
          }, {
            id: 29,
            title: 'Small Shoes',
            url: 'http://other.ca'
          }]
        }
      };
      const sendSearchEvent = spy();
      const service = new Tracker(flux, TEST_CONFIG);
      service.tracker = <any>{ sendSearchEvent };

      service.sendSearchEvent();

      expect(sendSearchEvent).to.have.been.calledWithMatch({
        search: {
          records: [{
            _id: 12,
            _t: 'Big Shoes',
            _u: 'http://example.com'
          }, {
            _id: 29,
            _t: 'Small Shoes',
            _u: 'http://other.ca'
          }]
        }
      });
    });
  });

  describe('listenForViewProduct()', () => {
    it('should listen for details event', () => {
      const flux: any = { on: () => null };
      const service = new Tracker(flux, TEST_CONFIG);

      service.listenForViewProduct();

      expectSubscriptions(() => service.listenForViewProduct(), {
        [Events.DETAILS]: null
      }, flux);
    });

    it('should call tracker.sendViewProductEvent()', () => {
      const record = { allMeta: { id: 125123, shortTitle: 'Shoes', cost: 113.49 } };
      const structure = { title: 'shortTitle', price: 'cost' };
      const flux: any = { on: (event, cb) => cb(record) };
      const sendViewProductEvent = spy();
      const service = new Tracker(flux, Object.assign({ structure }, TEST_CONFIG));
      service.tracker = <any>{ sendViewProductEvent };

      service.listenForViewProduct();

      expect(sendViewProductEvent).to.have.been.calledWith({
        product: {
          productId: 125123,
          title: 'Shoes',
          price: 113.49,
          category: 'NONE'
        }
      });
    });
  });

  describe('addToCart()', () => {
    it('should call tracker.sendAddToCartEvent()', () => {
      const event = { a: 'b' };
      const sendAddToCartEvent = spy();
      const service = new Tracker(<any>{}, TEST_CONFIG);
      service.tracker = <any>{ sendAddToCartEvent };

      service.addToCart(event);

      expect(sendAddToCartEvent).to.have.been.calledWith(event);
    });
  });

  describe('order()', () => {
    it('should call tracker.sendOrderEvent()', () => {
      const event = { a: 'b' };
      const sendOrderEvent = spy();
      const service = new Tracker(<any>{}, TEST_CONFIG);
      service.tracker = <any>{ sendOrderEvent };

      service.order(event);

      expect(sendOrderEvent).to.have.been.calledWith(event);
    });
  });

  describe('search()', () => {
    it('should call sendSearchEvent()', () => {
      const service = new Tracker(<any>{}, TEST_CONFIG);
      const sendSearchEvent = stub(service, 'sendSearchEvent');

      service.search();

      expect(sendSearchEvent).to.have.been.called;
    });
  });

  describe('didYouMean()', () => {
    it('should call sendSearchEvent()', () => {
      const service = new Tracker(<any>{}, TEST_CONFIG);
      const sendSearchEvent = stub(service, 'sendSearchEvent');

      service.didYouMean();

      expect(sendSearchEvent).to.have.been.calledWith('dym');
    });
  });

  describe('sayt()', () => {
    it('should call sendSearchEvent()', () => {
      const service = new Tracker(<any>{}, TEST_CONFIG);
      const sendSearchEvent = stub(service, 'sendSearchEvent');

      service.sayt();

      expect(sendSearchEvent).to.have.been.calledWith('sayt');
    });
  });
});
