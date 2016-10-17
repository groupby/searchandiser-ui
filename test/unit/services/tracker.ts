import { SESSION_COOKIE_KEY, Tracker, VISITOR_COOKIE_KEY } from '../../../src/services/tracker';
import { expectSubscriptions } from '../../utils/expectations';
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
  let service: Tracker;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    service = new Tracker(<any>{ on: () => null }, TEST_CONFIG);
  });
  afterEach(() => sandbox.restore());

  describe('on constuction', () => {
    it('should have default values', () => {
      service = new Tracker(<any>{}, TEST_CONFIG);

      expect(service.tracker).to.be.an.instanceof(GbTracker);
      expect(service._config).to.eql({});
    });

    it('should take global tracker config', () => {
      const trackerConfig = { visitorId: 14523, sessionId: 512908 };

      service = new Tracker(<any>{}, Object.assign({ tracker: trackerConfig }, TEST_CONFIG));

      expect(service._config).to.eq(trackerConfig);
    });
  });

  describe('init()', () => {
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
    it('should use configured ids', () => {
      const visitorId = '1faslkdj';
      const sessionId = 'lk15k3j4';
      const setVisitor = sandbox.stub(service, 'setVisitor');
      service._config = { visitorId, sessionId };

      service.setVisitorInfo();

      expect(setVisitor.calledWith(visitorId, sessionId)).to.be.true;
    });

    it('should use cookies', () => {
      const visitorId = '1faslkdj';
      const sessionId = 'lk15k3j4';
      const setVisitor = sandbox.stub(service, 'setVisitor');
      Cookies.set(VISITOR_COOKIE_KEY, visitorId);
      Cookies.set(SESSION_COOKIE_KEY, sessionId);

      service.setVisitorInfo();

      expect(setVisitor.calledWith(visitorId, sessionId)).to.be.true;
    });

    it('should generate ids', () => {
      const setVisitor = sandbox.stub(service, 'setVisitor', (visId, sessId) => {
        expect(visId).to.be.ok;
        expect(visId).to.have.length.gt(1);
        expect(sessId).to.be.ok;
        expect(sessId).to.have.length.gt(1);
      });

      service.setVisitorInfo();

      expect(setVisitor.called).to.be.true;
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
      const setVisitor = sinon.spy();
      service.tracker = <any>{ setVisitor };

      service.setVisitor(visitorId, sessionId);

      expect(setVisitor.calledWith(visitorId, sessionId)).to.be.true;
    });
  });

  describe('sendSearchEvent()', () => {
    it('should call tracker.sendSearchEvent()', () => {
      const results = { a: 'b', c: 'd' };
      const flux: any = { results };
      const sendSearchEvent = sinon.spy();
      service = new Tracker(flux, TEST_CONFIG);
      service.tracker = <any>{ sendSearchEvent };

      service.sendSearchEvent();

      expect(sendSearchEvent.calledWith({
        search: Object.assign({
          origin: { search: true },
          query: ''
        }, results)
      })).to.be.true;
    });

    it('should use originalQuery', () => {
      const originalQuery = 'shoes';
      const results = { originalQuery, a: 'b', c: 'd' };
      const flux: any = { results };
      const sendSearchEvent = sinon.spy((event) => expect(event.search.query).to.eq(originalQuery));
      service = new Tracker(flux, TEST_CONFIG);
      service.tracker = <any>{ sendSearchEvent };

      service.sendSearchEvent();

      expect(sendSearchEvent.called).to.be.true;
    });

    it('should allow overriding the origin', () => {
      const sendSearchEvent = sinon.spy((event) => expect(event.search.origin).to.eql({ dym: true }));
      service = new Tracker(<any>{ results: {} }, TEST_CONFIG);
      service.tracker = <any>{ sendSearchEvent };

      service.sendSearchEvent('dym');

      expect(sendSearchEvent.called).to.be.true;
    });
  });

  describe('listenForViewProduct()', () => {
    it('should listen for details event', () => {
      const flux: any = { on: () => null };
      service = new Tracker(flux, TEST_CONFIG);

      service.listenForViewProduct();

      expectSubscriptions(() => service.listenForViewProduct(), {
        [Events.DETAILS]: null
      }, flux);
    });

    it('should call tracker.sendViewProductEvent()', () => {
      const record = { allMeta: { id: 125123, shortTitle: 'Shoes', cost: 113.49 } };
      const structure = { title: 'shortTitle', price: 'cost' };
      const flux: any = { on: (event, cb) => cb(record) };
      const sendViewProductEvent = sinon.spy();
      service = new Tracker(flux, Object.assign({ structure }, TEST_CONFIG));
      service.tracker = <any>{ sendViewProductEvent };

      service.listenForViewProduct();

      expect(sendViewProductEvent.calledWith({
        product: {
          productId: 125123,
          title: 'Shoes',
          price: 113.49,
          category: 'NONE'
        }
      })).to.be.true;
    });
  });

  describe('addToCart()', () => {
    it('should call tracker.sendAddToCartEvent()', () => {
      const event = { a: 'b' };
      const sendAddToCartEvent = sinon.spy();
      service.tracker = <any>{ sendAddToCartEvent };

      service.addToCart(event);

      expect(sendAddToCartEvent.calledWith(event)).to.be.true;
    });
  });

  describe('order()', () => {
    it('should call tracker.sendOrderEvent()', () => {
      const event = { a: 'b' };
      const sendOrderEvent = sinon.spy();
      service.tracker = <any>{ sendOrderEvent };

      service.order(event);

      expect(sendOrderEvent.calledWith(event)).to.be.true;
    });
  });

  describe('search()', () => {
    it('should call sendSearchEvent()', () => {
      const sendSearchEvent = sandbox.stub(service, 'sendSearchEvent');

      service.search();

      expect(sendSearchEvent.calledWith()).to.be.true;
    });
  });

  describe('didYouMean()', () => {
    it('should call sendSearchEvent()', () => {
      const sendSearchEvent = sandbox.stub(service, 'sendSearchEvent');

      service.didYouMean();

      expect(sendSearchEvent.calledWith('dym')).to.be.true;
    });
  });

  describe('sayt()', () => {
    it('should call sendSearchEvent()', () => {
      const sendSearchEvent = sandbox.stub(service, 'sendSearchEvent');

      service.sayt();

      expect(sendSearchEvent.calledWith('sayt')).to.be.true;
    });
  });
});
