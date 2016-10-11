import { Collections, COLLECTIONS_UPDATED_EVENT } from '../../../src/services/collections';
import { expect } from 'chai';
import { Events, Request } from 'groupby-api';

describe('collections service', () => {
  let sandbox: Sinon.SinonSandbox;

  beforeEach(() => sandbox = sinon.sandbox.create());
  afterEach(() => sandbox.restore());

  describe('on construction', () => {
    it('should set properties', () => {
      const collectionsService = new Collections(<any>{}, <any>{});

      expect(collectionsService.collectionsConfig).to.eql({});
      expect(collectionsService.fetchCounts).to.be.true;
      expect(collectionsService.isLabeled).to.be.false;
      expect(collectionsService.collections).to.eql([]);
      expect(collectionsService.options).to.eql([]);
    });

    it('should take overrides for properties', () => {
      const options = [{ value: 'b' }];
      const collections = { collections: 'my collection', counts: false, options };
      const config: any = { tags: { collections } };
      const collectionsService = new Collections(<any>{}, config);
      collectionsService.counts = false;

      expect(collectionsService.collectionsConfig).to.eq(collections);
      expect(collectionsService.fetchCounts).to.be.false;
      expect(collectionsService.isLabeled).to.be.true;
      expect(collectionsService.collections).to.eql(['b']);
      expect(collectionsService.options).to.eq(options);
    });
  });

  describe('init()', () => {
    it('should update itself', (done) => {
      const collectionsService = new Collections(<any>{ on: () => null }, <any>{});

      collectionsService.updateCollectionCounts = () => done();
      collectionsService.init();
    });

    it('should listen events', () => {
      const flux: any = {
        on: (event, cb) => {
          switch (event) {
            case Events.QUERY_CHANGED:
              return expect(cb).to.be.a('function');
            case Events.RESULTS:
              return expect(cb).to.be.a('function');
            default:
              expect.fail();
          }
        }
      };
      const collectionsService = new Collections(flux, <any>{});

      collectionsService.init();
    });
  });

  describe('updateCollectionCounts()', () => {
    it('should update collection counts', () => {
      const collections = ['a', 'b', 'c'];
      const counts = {
        a: 10,
        b: 30,
        c: 50
      };
      const flux: any = {
        query: {
          raw: {
            pageSize: 50,
            fields: ['brand', 'size']
          }
        },
        bridge: {
          search: (request: Request) => {
            expect(request.collection).to.be.oneOf(collections);
            expect(request.pageSize).to.eq(0);
            expect(request.fields).to.be.empty;
            expect(request.refinements).to.be.empty;
            return Promise.resolve({ totalRecordCount: counts[request.collection] });
          }
        },
        emit: (event, newCounts) => {
          expect(event).to.eq(COLLECTIONS_UPDATED_EVENT);
          expect(newCounts).to.eql(counts);
        }
      };
      const collectionsService = new Collections(flux, <any>{});

      collectionsService.collections = collections;

      collectionsService.updateCollectionCounts();
      expect(collectionsService.inProgress).to.be.an.instanceof(Promise);
    });

    it('should not update collection counts if fetchCounts is false', () => {
      const flux: any = {
        bridge: {
          search: () => expect.fail()
        }
      };
      const collectionsService = new Collections(flux, <any>{});

      collectionsService.collections = ['a', 'b', 'c'];
      collectionsService.fetchCounts = false;

      collectionsService.updateCollectionCounts();
    });

    it('should cancel existing search', (done) => {
      const flux: any = {
        bridge: {},
        emit: () => done(),
        query: {
          raw: {}
        }
      };
      const collectionsService = new Collections(flux, <any>{});

      flux.bridge.search = () => {
        expect(collectionsService.inProgress.cancelled).to.be.true;
        return new Promise((resolve) => setTimeout(() => resolve({}), 100));
      };
      collectionsService.inProgress = <any>{};
      collectionsService.collections = ['a'];

      collectionsService.updateCollectionCounts();

      expect(collectionsService.inProgress).to.be.an.instanceof(Promise);
      expect(collectionsService.inProgress.cancelled).to.be.undefined;
    });

    it('should not update results if cancelled', (done) => {
      const flux: any = {
        bridge: {},
        query: { raw: {} }
      };
      const collectionsService = new Collections(flux, <any>{});

      flux.bridge.search = (): any => new Promise((resolve) => setTimeout(() => resolve({}), 100));
      collectionsService.collections = ['a'];

      collectionsService.updateCollectionCounts();

      setTimeout(() => collectionsService.inProgress.cancelled = false, 50);
      setTimeout(() => done(), 150);
    });
  });

  describe('updateSelectedCollectionCount()', () => {
    it('should update selected collection count', () => {
      const collection = 'mycollection';
      const totalRecordCount = 450;
      const flux: any = {
        emit: (event, counts) => {
          expect(event).to.eq(COLLECTIONS_UPDATED_EVENT);
          expect(counts).to.eql({ [collection]: totalRecordCount });
        },
        query: { raw: { collection } }
      };
      const collectionsService = new Collections(flux, <any>{});

      collectionsService.updateSelectedCollectionCount(<any>{ totalRecordCount });
    });

    it('should update selected collection count with existing counts', () => {
      const collection = 'mycollection';
      const totalRecordCount = 450;
      const flux: any = {
        query: { raw: { collection } },
        emit: (event, counts) => {
          expect(event).to.eq(COLLECTIONS_UPDATED_EVENT);
          expect(counts).to.eql({
            [collection]: totalRecordCount,
            prod: 403,
            test: 330
          });
        }
      };
      const collectionsService = new Collections(flux, <any>{});

      collectionsService.counts = { prod: 403, test: 330 };

      collectionsService.updateSelectedCollectionCount(<any>{ totalRecordCount });
    });
  });

  describe('isSelected()', () => {
    it('should determine if collection is currently selected', () => {
      const collection = 'my collection';
      const flux: any = { query: { raw: { collection } } };
      const collectionsService = new Collections(flux, <any>{});

      expect(collectionsService.isSelected(collection)).to.be.true;
      expect(collectionsService.isSelected('some collection')).to.be.false;
    });
  });

  describe('selectedCollection()', () => {
    it('should return the currently configured collection', () => {
      const collection = 'my collection';
      const flux: any = { query: { raw: { collection } } };
      const collectionsService = new Collections(flux, <any>{});

      expect(collectionsService.selectedCollection).to.eq(collection);
    });

    it('should default to originally configured collection', () => {
      const collection = 'other collection';
      const config: any = { collection };
      const collectionsService = new Collections(<any>{}, config);

      expect(collectionsService.selectedCollection).to.eq(collection);
    });
  });
});
