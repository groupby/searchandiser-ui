import { COLLECTIONS_UPDATED_EVENT } from '../../../src/services/collections';
import { Collections, DEFAULT_CONFIG } from '../../../src/tags/collections/gb-collections';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-collections', Collections, ({
  flux, tag, spy, stub,
  expectSubscriptions,
  itShouldConfigure
}) => {

  describe('init()', () => {
    beforeEach(() => tag().services = <any>{ collections: {} });

    itShouldConfigure(DEFAULT_CONFIG);

    it('should set options from calculated config', () => {
      const options = [{ a: 'b' }];
      tag().configure = () => tag().$config = <any>{ options };

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
      const collections = ['a', 'b', 'c'];
      tag().configure = () => tag().$config = { options };
      tag().services = <any>{ collections: { collections, isLabeled: true } };

      tag().init();

      expect(tag().collections).to.eq(collections);
      expect(tag().labels).to.eql({ a: 'A', b: 'B', c: 'C' });
    });

    it('should listen for collections_updated event', () => {
      expectSubscriptions(() => tag().init(), {
        [COLLECTIONS_UPDATED_EVENT]: tag().updateCounts
      });
    });
  });

  describe('switchCollection()', () => {
    it('should call onselect with collection', () => {
      const collection = 'my collection';
      const onselect = stub(tag(), 'onselect');

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

      expect(onselect).to.have.been.calledWith(collection);
    });
  });

  describe('updateCounts', () => {
    it('should call update() with counts', () => {
      const counts = [{ a: 'b' }];
      const update = tag().update = spy();

      tag().updateCounts(counts);

      expect(update).to.have.been.calledWith({ counts });
    });
  });

  describe('onselect()', () => {
    it('should call flux.switchCollection()', () => {
      const collection = 'onsale';
      const switchCollection = stub(flux(), 'switchCollection');

      tag().onselect(collection);

      expect(switchCollection).to.have.been.calledWith(collection);
    });
  });
});
