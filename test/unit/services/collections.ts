import { Collections, COLLECTIONS_UPDATED_EVENT } from '../../../src/services/collections';
import { expectSubscriptions } from '../../utils/expectations';
import suite from './_suite';
import { expect } from 'chai';
import { Events, Request } from 'groupby-api';

suite('collections', ({ spy, stub }) => {

  describe('on construction', () => {
    it('should set properties', () => {
      const service = new Collections(<any>{}, <any>{});

      expect(service.fetchCounts).to.be.true;
      expect(service.collections).to.eql([]);
      expect(service._config).to.eql({ items: [] });
    });

    it('should take overrides for properties', () => {
      const items = [{ value: 'b' }];
      const collections = { showCounts: false, items };
      const config: any = { tags: { collections } };

      const service = new Collections(<any>{}, config);

      expect(service.fetchCounts).to.be.false;
      expect(service.collections).to.eql(['b']);
      expect(service._config).to.eql({ items });
    });
  });

  describe('init()', () => {
    it('should update itself', (done) => {
      const service = new Collections(<any>{ on: () => null }, <any>{});
      service.updateCollectionCounts = () => done();

      service.init();
    });

    it('should listen events', () => {
      const flux: any = {};
      const service = new Collections(flux, <any>{});

      expectSubscriptions(() => service.init(), {
        [Events.QUERY_CHANGED]: null,
        [Events.RESULTS]: null
      }, flux);
    });
  });

  describe('updateCollectionCounts()', () => {
    let service: Collections;

    beforeEach(() => service = new Collections(<any>{}, <any>{}));

    it('should update collection counts', (done) => {
      const collections = ['a', 'b', 'c'];
      const counts = { a: 10, b: 30, c: 50 };
      const emit = spy();
      const flux: any = {
        emit,
        query: { raw: { pageSize: 50, fields: ['brand', 'size'] } },
        bridge: {
          search: (request: Request) => {
            expect(request.collection).to.be.oneOf(collections);
            expect(request.pageSize).to.eq(0);
            expect(request.fields).to.eq('');
            expect(request.refinements).to.eql([]);
            return Promise.resolve({ totalRecordCount: counts[request.collection] });
          }
        }
      };
      service = new Collections(flux, <any>{});
      service.collections = collections;
      service.extractCounts = (res) => {
        expect(res).to.have.deep.members([
          { results: { totalRecordCount: counts.a }, collection: 'a' },
          { results: { totalRecordCount: counts.b }, collection: 'b' },
          { results: { totalRecordCount: counts.c }, collection: 'c' }
        ]);
        return counts;
      };

      service.updateCollectionCounts()
        .then(() => {
          expect(emit).to.be.calledWith(COLLECTIONS_UPDATED_EVENT, counts);
          expect(service.inProgress).to.be.an.instanceof(Promise);
          done();
        });
    });

    it('should not update collection counts if fetchCounts is false', () => {
      const flux: any = { bridge: { search: () => expect.fail() } };
      service = new Collections(flux, <any>{});
      service.collections = ['a', 'b', 'c'];
      service.fetchCounts = false;

      service.updateCollectionCounts();
    });

    it('should cancel existing search', (done) => {
      const flux: any = {
        bridge: {},
        emit: () => done(),
        query: { raw: {} }
      };
      const search =
        flux.bridge.search =
        spy(() => {
          expect(service.inProgress.cancelled).to.be.true;
          return new Promise((resolve) => setTimeout(() => resolve({}), 100));
        });
      service = new Collections(flux, <any>{});
      service.inProgress = <any>{};
      service.collections = ['a'];

      service.updateCollectionCounts();

      expect(service.inProgress).to.be.an.instanceof(Promise);
      expect(service.inProgress.cancelled).to.be.undefined;
      expect(search).to.be.called;
    });

    it('should not update results if cancelled', (done) => {
      const flux: any = { bridge: {}, query: { raw: {} } };
      const search =
        flux.bridge.search =
        spy(() => new Promise((resolve) => setTimeout(() => resolve({}), 50)));
      service = new Collections(flux, <any>{});
      const extractCounts = stub(service, 'extractCounts', () => {
        service.inProgress.cancelled = true;
        flux.emit = spy();
      });
      service.collections = ['a'];

      service.updateCollectionCounts();

      setTimeout(() => {
        expect(search).to.be.called;
        expect(extractCounts).to.be.called;
        expect(flux.emit).to.not.have.been.called;
        done();
      }, 100);
    });
  });

  describe('extractCounts()', () => {
    it('should reduce results with collection to count map', () => {
      const results = [
        { results: { totalRecordCount: 11 }, collection: 'a' },
        { results: { totalRecordCount: 1412 }, collection: 'b' },
        { results: { totalRecordCount: 409 }, collection: 'c' }
      ];
      const service = new Collections(<any>{}, <any>{});

      const counts = service.extractCounts(results);

      expect(counts).to.eql({
        a: 11,
        b: 1412,
        c: 409
      });
    });
  });

  describe('updateSelectedCollectionCount()', () => {
    it('should update selected collection count', () => {
      const collection = 'mycollection';
      const totalRecordCount = 450;
      const emit = spy();
      const flux: any = { emit, query: { raw: { collection } } };
      const service = new Collections(flux, <any>{});

      service.updateSelectedCollectionCount(<any>{ totalRecordCount });

      expect(emit).to.be.calledWith(COLLECTIONS_UPDATED_EVENT, {
        [collection]: totalRecordCount
      });
    });

    it('should update selected collection count with existing counts', () => {
      const collection = 'mycollection';
      const totalRecordCount = 450;
      const emit = spy();
      const flux: any = { emit, query: { raw: { collection } } };
      const service = new Collections(flux, <any>{});
      service.counts = { prod: 403, test: 330 };

      service.updateSelectedCollectionCount(<any>{ totalRecordCount });

      expect(emit).to.be.calledWith(COLLECTIONS_UPDATED_EVENT, {
        [collection]: totalRecordCount,
        prod: 403,
        test: 330
      });
    });
  });

  describe('isSelected()', () => {
    it('should determine if collection is currently selected', () => {
      const collection = 'my collection';
      const flux: any = { query: { raw: { collection } } };
      const service = new Collections(flux, <any>{});

      expect(service.isSelected(collection)).to.be.true;
      expect(service.isSelected('some collection')).to.be.false;
    });
  });

  describe('isLabeled()', () => {
    let service: Collections;

    beforeEach(() => service = new Collections(<any>{}, <any>{}));

    it('should return true', () => {
      expect(service.isLabeled(<any[]>[{ a: 'b' }])).to.be.true;
    });

    it('should return false', () => {
      expect(service.isLabeled([])).to.be.false;
      expect(service.isLabeled(['a'])).to.be.false;
    });
  });

  describe('selectedCollection()', () => {
    it('should return the currently configured collection', () => {
      const collection = 'my collection';
      const flux: any = { query: { raw: { collection } } };
      const service = new Collections(flux, <any>{});

      expect(service.selectedCollection).to.eq(collection);
    });

    it('should default to originally configured collection', () => {
      const collection = 'other collection';
      const config: any = { collection };
      const service = new Collections(<any>{}, config);

      expect(service.selectedCollection).to.eq(collection);
    });
  });
});
