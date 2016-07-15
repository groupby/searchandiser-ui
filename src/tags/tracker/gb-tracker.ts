import GbTracker = require('gb-tracker-client');
import { Results, Events, Record } from 'groupby-api';

export function Tracker() {

  let tracker = null;

  this.init = function() {
    tracker = new GbTracker(this.opts.config.customerId, this.opts.config.area || 'Production');
    tracker.setVisitor(this.opts.visitorId, this.opts.sessionId);

    this.initHandlers();
  };

  this.initHandlers = function() {
    switch (this.opts.event) {
      case 'addToBasket': return this.handleAddToBasket();
      case 'order': return this.handleOrder();
      case 'search': return this.handleSearch();
      case 'viewProduct': return this.handleViewProduct();
      default:
        console.error('invalid event type', this.opts.event);
    }
  };

  this.handleAddToBasket = function(): void {
    tracker.sendAddToBasketEvent({
      product: {
        id: 'asdfasd',
        category: 'boats',
        collection: 'kayaksrus',
        title: 'kayak',
        sku: 'asdfasf98',
        price: 100.21
      }
    });
  };

  this.handleOrder = function(): void {
    tracker.sendOrderEvent({
      products: [
        {
          id: 'asdfasd',
          category: 'boats',
          collection: 'kayaksrus',
          title: 'kayak',
          sku: 'asdfasf98',
          price: 100.21
        },
        {
          id: 'rrr',
          category: 'boats',
          collection: 'kayaksrus',
          title: 'kayak',
          sku: 'asdfasf98',
          price: 55.55
        }
      ]
    });
  };

  this.handleSearch = function(): void {
    this.opts.flux.on(Events.RESULTS, (results: Results) => {
      const request = this.opts.flux.query.raw;
      tracker.sendSearchEvent({
        search: {
          totalRecordCount: results.totalRecordCount,
          recordEnd: results.pageInfo.recordEnd,
          recordStart: results.pageInfo.recordStart,
          refinements: request.refinements,
          origin: {},
          searchResponse: results.records.map(record => record.allMeta.id),
          searchTerm: request.query
        }
      });
    });
  };

  this.handleViewProduct = function(): void {
    this.opts.flux.on(Events.DETAILS, (record: Record) => {
      tracker.sendViewProductEvent({
        product: record.allMeta
      });
    });
  };
}
