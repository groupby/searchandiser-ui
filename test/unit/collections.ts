import { FluxCapacitor, Events, Request } from 'groupby-api';
import { fluxTag } from '../utils/tags';
import { Collections } from '../../src/tags/collections/gb-collections';
import { expect } from 'chai';

describe('gb-collections logic', () => {
  let tag: Collections,
    flux: FluxCapacitor;

  beforeEach(() => ({ tag, flux } = fluxTag(new Collections())));

  it('should have default values', () => {
    tag.init();

    expect(tag.fetchCounts).to.be.true;
    expect(tag.collections).to.eql([]);
    expect(tag.labels).to.eql({});
    expect(tag.counts).to.not.be.ok;
  });

  it('should allow override from global tag config', () => {
    const options = ['a', 'b', 'c'];
    tag.config = { tags: { collections: { counts: false, options } } }
    tag.init();

    expect(tag.fetchCounts).to.be.false;
    expect(tag.collections).to.eq(options);
  });

  it('should allow override from opts', () => {
    const options = ['a', 'b', 'c'];
    tag.opts = { counts: false, options };
    tag.init();

    expect(tag.fetchCounts).to.be.false;
    expect(tag.collections).to.eq(options);
  });

  it('should accept collections with labels', () => {
    const options = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
      { value: 'c', label: 'C' }];
    tag.opts = { counts: false, options };
    tag.init();

    expect(tag.fetchCounts).to.be.false;
    expect(tag.collections).to.eql(options.map((collection) => collection.value));
    expect(tag.labels).to.eql({
      a: 'A',
      b: 'B',
      c: 'C'
    });
  });

  it('should update itself on mount', (done) => {
    tag.updateCollectionCounts = () => done();
    tag.init();
  });

  it('should listen for request_changed event', () => {
    flux.on = (event: string, cb: Function): any => {
      expect(event).to.eq(Events.REQUEST_CHANGED);
      expect(cb).to.eq(tag.updateCollectionCounts);
    };

    tag.init();
  });

  it('should update collection counts', (done) => {
    const counts = {
      a: 10,
      b: 30,
      c: 50
    };

    flux.bridge.search = (request: Request): any => Promise.resolve({ totalRecordCount: counts[request.collection] });

    tag.update = (obj: any) => {
      expect(obj.counts).to.eql(counts);
      done();
    };
    tag.init();
    tag.collections = ['a', 'b', 'c'];

    tag.updateCollectionCounts();
  });

  it('should not update collection counts if fetchCounts is false', () => {
    flux.bridge.search = (): any => expect.fail();

    tag.init();
    tag.collections = ['a', 'b', 'c'];
    tag.fetchCounts = false;

    tag.updateCollectionCounts();
  });
});
