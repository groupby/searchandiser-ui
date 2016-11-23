import { SearchandiserConfig } from '../searchandiser';
import { ProductTransformer } from '../utils/product-transformer';
import * as GbTracker from 'gb-tracker-client';
import filterObject = require('filter-object');
import { Events, FluxCapacitor } from 'groupby-api';
import * as Cookies from 'js-cookie';
import * as uuid from 'uuid';

export const MAX_COOKIE_AGE = 365; // days
export const VISITOR_COOKIE_KEY = 'visitor';
export const SESSION_COOKIE_KEY = 'session';

export interface TrackerConfig {
  sessionId?: string;
  visitorId?: string;
}

export class Tracker {

  _config: TrackerConfig;
  tracker: TrackerClient;
  transformer: ProductTransformer;

  constructor(private flux: FluxCapacitor, private config: SearchandiserConfig) {
    this._config = this.config.tracker || {};
    this.tracker = new GbTracker(this.config.customerId, this.config.area);
    this.transformer = new ProductTransformer(this.config.structure || {});
  }

  init() {
    this.setVisitorInfo();

    this.listenForViewProduct();
  }

  setVisitorInfo() {
    const visitorId = this._config.visitorId
      || Cookies.get(VISITOR_COOKIE_KEY)
      || uuid.v1();
    const sessionId = this._config.sessionId
      || Cookies.get(SESSION_COOKIE_KEY)
      || uuid.v1();

    this.setVisitor(visitorId, sessionId);
  }

  listenForViewProduct() {
    this.flux.on(Events.DETAILS, ({ allMeta }) => {
      const productMeta = this.transformer.transform(allMeta);
      this.tracker.sendViewProductEvent({
        product: {
          productId: productMeta().id,
          title: productMeta().title,
          price: productMeta().price,
          category: 'NONE'
        }
      });
    });
  }

  setVisitor(visitorId: string, sessionId: string) {
    this.tracker.setVisitor(visitorId, sessionId);

    Cookies.set(VISITOR_COOKIE_KEY, visitorId, { expires: MAX_COOKIE_AGE });
    Cookies.set(SESSION_COOKIE_KEY, sessionId);
  }

  search() {
    this.sendSearchEvent();
  }

  didYouMean() {
    this.sendSearchEvent('dym');
  }

  sayt() {
    this.sendSearchEvent('sayt');
  }

  addToCart(productsInfo: any) {
    this.tracker.sendAddToCartEvent(productsInfo);
  }

  order(productsInfo: any) {
    this.tracker.sendOrderEvent(productsInfo);
  }

  sendSearchEvent(origin: string = 'search') {
    const convertedRecords = this.flux.results.records.map((record) => Object.assign({
      _id: record.id,
      _u: record.url,
      _t: record.title,
    }, filterObject(record, '!{id,url,title}')));

    this.tracker.sendSearchEvent({
      search: Object.assign({
        origin: { [origin]: true },
        query: this.flux.results.originalQuery || ''
      }, this.flux.results, {
          records: convertedRecords
        })
    });
  }
}
