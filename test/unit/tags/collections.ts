import { Collections } from '../../../src/tags/collections/gb-collections';
import suite from './_suite';
import { expect } from 'chai';
import { Events, Query, Request } from 'groupby-api';

suite('gb-collections', Collections, ({ flux, tag }) => {
  it('should have default values', () => {
    tag().init();

    expect(tag().fetchCounts).to.be.true;
    expect(tag().collections).to.eql([]);
    expect(tag().options).to.eql([]);
    expect(tag().labels).to.eql({});
    expect(tag().counts).to.not.be.ok;
  });

  it('should allow override from global tag config', () => {
    const options = ['a', 'b', 'c'];
    tag().config = { tags: { collections: { counts: false, options } } };
    tag().init();

    expect(tag().fetchCounts).to.be.false;
    expect(tag().options).to.eq(options);
    expect(tag().collections).to.eq(options);
  });

  it('should allow override from opts', () => {
    const options = ['a', 'b', 'c'];
    tag().opts = { counts: false, options };
    tag().init();

    expect(tag().fetchCounts).to.be.false;
    expect(tag().options).to.eq(options);
    expect(tag().collections).to.eq(options);
  });

  it('should accept collections with labels', () => {
    const options = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
      { value: 'c', label: 'C' }];
    tag().opts = { counts: false, options };
    tag().init();

    expect(tag().fetchCounts).to.be.false;
    expect(tag().options).to.eql(options);
    expect(tag().collections).to.eql(options.map((collection) => collection.value));
    expect(tag().labels).to.eql({
      a: 'A',
      b: 'B',
      c: 'C'
    });
  });

  it('should update itself on mount', (done) => {
    tag().updateCollectionCounts = () => done();
    tag().init();
  });

  it('should listen events', () => {
    flux().on = (event: string, cb: Function): any => {
      switch (event) {
        case Events.QUERY_CHANGED:
          return expect(cb).to.eq(tag().updateCollectionCounts);
        case Events.RESULTS:
          return expect(cb).to.eq(tag().updateSelectedCollectionCount);
        default:
          expect.fail();
      }
    };

    tag().init();
  });

  describe('updateCollectionCounts()', () => {
    it('should update collection counts', () => {
      const collections = ['a', 'b', 'c'];
      const counts = {
        a: 10,
        b: 30,
        c: 50
      };

      flux().query.withPageSize(50)
        .withFields('brand', 'size');

      flux().bridge.search = (request: Request): any => {
        expect(request.collection).to.be.oneOf(collections);
        expect(request.pageSize).to.eq(0);
        expect(request.fields).to.be.empty;
        expect(request.refinements).to.be.empty;
        return Promise.resolve({ totalRecordCount: counts[request.collection] });
      };

      tag().update = (obj: any) => {
        expect(obj.counts).to.eql(counts);
      };
      tag().init();
      tag().collections = collections;

      tag().updateCollectionCounts();
      expect(tag().inProgress).to.be.an.instanceof(Promise);
    });

    it('should not update collection counts if fetchCounts is false', () => {
      flux().bridge.search = (): any => expect.fail();

      tag().init();
      tag().collections = ['a', 'b', 'c'];
      tag().fetchCounts = false;

      tag().updateCollectionCounts();
    });

    it('should cancel existing search', (done) => {
      flux().bridge.search = (): any => {
        expect(tag().inProgress.cancelled).to.be.true;
        return new Promise((resolve) => setTimeout(() => resolve({}), 100));
      };

      tag().inProgress = <any>{};
      tag().update = (obj: any) => done();
      tag().init();
      tag().collections = ['a'];

      tag().updateCollectionCounts();
      expect(tag().inProgress).to.be.an.instanceof(Promise);
      expect(tag().inProgress.cancelled).to.be.undefined;
    });

    it('should not update results if cancelled', (done) => {
      flux().bridge.search = (): any => new Promise((resolve) => setTimeout(() => resolve({}), 100));

      tag().update = (obj: any) => expect.fail();
      tag().init();
      tag().collections = ['a'];

      tag().updateCollectionCounts();
      setTimeout(() => tag().inProgress.cancelled = false, 50);
      setTimeout(() => done(), 150);
    });
  });

  describe('updateSelectedCollectionCount()', () => {
    it('should update selected collection count', () => {
      const collection = 'mycollection';
      const totalRecordCount = 450;

      flux().query = new Query().withConfiguration({ collection });

      tag().update = (obj: any) => {
        expect(obj.counts).to.eql({ [collection]: totalRecordCount });
      };
      tag().init();

      tag().updateSelectedCollectionCount(<any>{ totalRecordCount });
    });

    it('should update selected collection count with existing counts', () => {
      const collection = 'mycollection';
      const totalRecordCount = 450;

      flux().query = new Query().withConfiguration({ collection });

      tag().update = (obj: any) => {
        expect(obj.counts).to.eql({
          [collection]: totalRecordCount,
          prod: 403,
          test: 330
        });
      };
      tag().init();
      tag().counts = { prod: 403, test: 330 };

      tag().updateSelectedCollectionCount(<any>{ totalRecordCount });
    });
  });

  it('should switch collection using value on anchor tag', () => {
    const collection = 'my collection';

    tag().init();
    tag().onselect = (coll) => expect(coll).to.eq(collection);

    tag().switchCollection(<any>{
      target: {
        tagName: 'SPAN',
        parentElement: {
          tagName: 'A',
          dataset: {
            collection
          }
        }
      }
    });
  });

  it('should switch collection', () => {
    const collection = 'my collection';

    flux().switchCollection = (coll): any => expect(coll).to.eq(collection);
    tag().init();

    tag().onselect(collection);
  });

  it('should determine if collection is currently selected', () => {
    const collection = 'my collection';

    flux().query.withConfiguration({ collection });
    tag().init();

    expect(tag().selected(collection)).to.be.true;
    expect(tag().selected('some collection')).to.be.false;
  });

});
