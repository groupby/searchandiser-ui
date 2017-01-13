import { COLLECTIONS_UPDATED_EVENT } from '../../../src/services/collections';
import { Collections } from '../../../src/tags/collections/gb-collections';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-collections', Collections, ({
  flux, tag, spy, stub,
  expectSubscriptions,
  itShouldAlias
}) => {

  describe('init()', () => {
    beforeEach(() => tag().services = <any>{ collections: {} });

    itShouldAlias(['collections', 'listable', 'selectable']);

    it('should set default values', () => {
      tag().init();

      expect(tag().showCounts).to.be.true;
      expect(tag().dropdown).to.be.false;
      expect(tag().counts).to.eql({});
    });

    it('should set properties from opts', () => {
      tag().opts = { showCounts: false, dropdown: true };

      tag().init();

      expect(tag().showCounts).to.be.false;
      expect(tag().dropdown).to.be.true;
    });

    it('should set properties from collections service', () => {
      const items = ['a', 'b'];
      tag().services = <any>{ collections: { items } };

      tag().init();

      expect(tag().items).to.eq(items);
    });

    it('should listen for collections_updated event', () => {
      expectSubscriptions(() => tag().init(), {
        [COLLECTIONS_UPDATED_EVENT]: tag().updateCounts
      });
    });
  });

  describe('switchCollection()', () => {
    it('should call onSelect with collection', () => {
      const collection = 'my collection';
      const onSelect = stub(tag(), 'onSelect');

      tag().switchCollection(<any>{
        currentTarget: {
          dataset: {
            collection
          }
        }
      });

      expect(onSelect).to.have.been.calledWith(collection);
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

  describe('onSelect()', () => {
    it('should call flux.switchCollection()', () => {
      const collection = 'onsale';
      const switchCollection = stub(flux(), 'switchCollection');

      tag().onSelect(collection);

      expect(switchCollection).to.have.been.calledWith(collection);
    });
  });
});
