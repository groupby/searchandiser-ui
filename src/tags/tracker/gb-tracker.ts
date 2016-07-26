import { Results, Events, Record } from 'groupby-api';

export class Tracker {

  opts: any;

  init = function() {
    this.opts.tracker.setVisitor(this.opts.visitorId, this.opts.sessionId);

    this.initHandlers();
  };

  initHandlers = function() {
    switch (this.opts.event) {
      case 'addToBasket': return this.handleAddToBasket();
      case 'order': return this.handleOrder();
      case 'search': return this.handleSearch();
      case 'viewProduct': return this.handleViewProduct();
      default:
        console.error('invalid event type', this.opts.event);
    }
  };

  handleAddToBasket = function(): void {
    this.opts.trackerConfig.

    this.opts.tracker.sendAddToBasketEvent({
      product: {
        id: 'asdfasd',
        category: 'boats',
        collection: 'kayaksrus',
        title: 'kayak',
        sku: 'asdfasf98',
        price: 100.21,
        qty: 100
      }
    });
  };

  handleOrder = function(): void {
    this.opts.tracker.sendOrderEvent({
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

  handleSearch = function(): void {
    this.opts.flux.on(Events.RESULTS, (results: Results) => {
      const request = this.opts.flux.query.raw;
      this.opts.tracker.sendSearchEvent({
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

  handleViewProduct = function(): void {
    this.opts.flux.on(Events.DETAILS, (record: Record) => {
      this.opts.tracker.sendViewProductEvent({
        product: record.allMeta
      });
    });
  };
}
