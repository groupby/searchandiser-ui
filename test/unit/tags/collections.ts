import { COLLECTIONS_UPDATED_EVENT } from '../../../src/services/collections';
import { Collections, DEFAULT_CONFIG } from '../../../src/tags/collections/gb-collections';
import suite from './_suite';
import { expect } from 'chai';

const SERVICES = {
  collections: {}
};

suite('gb-collections', Collections, { services: SERVICES }, ({
  flux, tag,
  expectSubscriptions,
  itShouldConfigure
}) => {

  describe('init()', () => {
    itShouldConfigure(DEFAULT_CONFIG);

    it('should set options from calculated config', () => {
      const options = [{ a: 'b' }];
      tag().configure = () => tag()._config = <any>{ options };

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
      expectSubscriptions(() => tag().init(), {
        [COLLECTIONS_UPDATED_EVENT]: tag().updateCounts
      });
    });
  });

  describe('switchCollection()', () => {
    it('should switch collection using value on anchor tag', () => {
      const collection = 'my collection';
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
      tag().onselect = (coll) => expect(coll).to.eq(collection);

      tag().onselect(collection);
    });
  });

  describe('updateCounts', () => {
    it('should call update() with counts', () => {
      const newCounts = [{ a: 'b' }];
      tag().update = ({counts}) => expect(counts).to.eq(newCounts);

      tag().updateCounts(newCounts);
    });
  });

  describe('onselect()', () => {
    it('should call flux.switchCollection()', () => {
      const collection = 'onsale';
      flux().switchCollection = (coll): any => expect(coll).to.eq(collection);

      tag().onselect(collection);
    });
  });
});
