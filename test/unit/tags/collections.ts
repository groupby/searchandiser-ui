import { COLLECTIONS_UPDATED_EVENT } from '../../../src/services/collections';
import { Collections, DEFAULT_CONFIG } from '../../../src/tags/collections/gb-collections';
import suite from './_suite';
import { expect } from 'chai';

const SERVICES = {
  collections: {}
};

suite('gb-collections', Collections, { services: SERVICES }, ({ flux, tag }) => {
  it('should configure itself with defaults', (done) => {
    tag().configure = (defaults) => {
      expect(defaults).to.eq(DEFAULT_CONFIG);
      done();
    };

    tag().init();
  });

  it('should have default config', () => {
    const options = [{ a: 'b' }];
    tag().config = <any>{ tags: { collections: { options, counts: true } } };
    tag().init();

    expect(tag()._config).to.eql({ options, counts: true });
  });

  it('should allow override from global tag config', () => {
    const options = ['a', 'b', 'c'];
    const collectionsConfig = { counts: false, options };

    tag().config = { tags: { collections: collectionsConfig } };
    tag().init();

    expect(tag()._config).to.eql(collectionsConfig);
  });

  it('should allow override from opts', () => {
    tag().opts = { a: 'b' };
    tag().init();

    expect(tag()._config).to.eql({ options: [], a: 'b' });
  });

  it('should get values from collections service', () => {
    tag().services = <any>{ collections: { collections: [], fetchCounts: true } };
    tag().init();

    expect(tag().fetchCounts).to.be.true;
    expect(tag().collections).to.eql([]);
  });

  it('should accept collections with labels', () => {
    const options = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
      { value: 'c', label: 'C' }];
    tag().config = { tags: { collections: { options } } };
    tag().services = <any>{
      collections: {
        collections: ['a', 'b', 'c'],
        fetchCounts: false,
        isLabeled: true
      }
    };
    tag().init();

    expect(tag().fetchCounts).to.be.false;
    expect(tag().collections).to.eql(options.map((collection) => collection.value));
    expect(tag().labels).to.eql({
      a: 'A',
      b: 'B',
      c: 'C'
    });
  });

  it('should listen for collections_updated event', () => {
    flux().on = (event: string, cb: Function): any => {
      expect(event).to.eq(COLLECTIONS_UPDATED_EVENT);
      expect(cb).to.be.a('function');
    };

    tag().init();
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
});
