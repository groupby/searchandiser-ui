import { COLLECTIONS_UPDATED_EVENT } from '../../../src/services/collections';
import { Collections, DEFAULT_CONFIG } from '../../../src/tags/collections/gb-collections';
import suite from './_suite';
import { expect } from 'chai';

const SERVICES = {
  collections: {}
};

suite('gb-collections', Collections, { services: SERVICES }, ({ flux, tag }) => {
  describe('init()', () => {
    it('should configure itself with defaults', (done) => {
      tag().configure = (defaults) => {
        expect(defaults).to.eq(DEFAULT_CONFIG);
        done();
      };

      tag().init();
    });

    it('should set options from calculated config', () => {
      const options = [{ a: 'b' }];
      tag()._config = <any>{ options };
      tag().configure = () => null;
      tag().init();

      expect(tag().options).to.eql(options);
    });

    it('should get values from collections service', () => {
      tag().services = <any>{ collections: { collections: [] } };
      tag().init();

      expect(tag().collections).to.eql([]);
    });

    it('should accept collections with labels', () => {
      const options = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
        { value: 'c', label: 'C' }];
      tag().configure = () => tag()._config = { options };
      tag().services = <any>{
        collections: {
          collections: ['a', 'b', 'c'],
          isLabeled: true
        }
      };
      tag().init();

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
