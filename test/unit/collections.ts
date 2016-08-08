import { FluxCapacitor, Events, Request } from 'groupby-api';
import { Collections } from '../../src/tags/collections/gb-collections';
import { expect } from 'chai';

describe('gb-collections logic', () => {
  let collections: Collections,
    flux: FluxCapacitor;

  beforeEach(() => collections = Object.assign(new Collections(), {
    flux: flux = new FluxCapacitor(''),
    opts: {}
  }));

  it('should have default values', () => {
    collections.init();

    expect(collections.badge).to.be.true;
    expect(collections.collections).to.eql([]);
    expect(collections.labels).to.eql({});
    expect(collections.counts).to.not.be.ok;
  });

  it('should allow override from global tag config', () => {
    const options = ['a', 'b', 'c'];
    collections.config = { tags: { collections: { badge: false, options } } }
    collections.init();

    expect(collections.badge).to.be.false;
    expect(collections.collections).to.eq(options);
  });

  it('should allow override from opts', () => {
    const options = ['a', 'b', 'c'];
    collections.opts = { badge: false, options };
    collections.init();

    expect(collections.badge).to.be.false;
    expect(collections.collections).to.eq(options);
  });

  it('should accept collections with labels', () => {
    const options = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
      { value: 'c', label: 'C' }];
    collections.opts = { badge: false, options };
    collections.init();

    expect(collections.badge).to.be.false;
    expect(collections.collections).to.eql(options.map((collection) => collection.value));
    expect(collections.labels).to.eql({
      a: 'A',
      b: 'B',
      c: 'C'
    });
  });

  it('should update itself on mount', (done) => {
    collections.updateCollectionCounts = () => done();
    collections.init();
  });

  it('should listen for request_changed event', () => {
    flux.on = (event: string, cb: Function): any => {
      expect(event).to.eq(Events.REQUEST_CHANGED);
      expect(cb).to.eq(collections.updateCollectionCounts);
    };

    collections.init();
  });

  it('should update collection counts', (done) => {
    const counts = {
      a: 10,
      b: 30,
      c: 50
    };

    flux.bridge.search = (request: Request): any => Promise.resolve({ totalRecordCount: counts[request.collection] });

    collections.update = (obj: any) => {
      expect(obj.counts).to.eql(counts);
      done();
    };
    collections.init();
    collections.collections = ['a', 'b', 'c'];

    collections.updateCollectionCounts();
  });
});
