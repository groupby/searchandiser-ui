import { COLLECTIONS_UPDATED_EVENT } from '../../../src/services/collections';
import { Collections, DEFAULTS, SERVICES, TYPES } from '../../../src/tags/collections/gb-collections';
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

    it('should listen for collections_updated event', () => {
      expectSubscriptions(() => tag().init(), {
        [COLLECTIONS_UPDATED_EVENT]: tag().updateCounts
      });
    });
  });

  describe('onConfigure()', () => {
    it('should call configure()', () => {
      const configure = spy();
      tag().services = <any>{ collections: {} };

      tag().onConfigure(configure);

      expect(configure).to.have.been.calledWith({ defaults: DEFAULTS, types: TYPES, services: SERVICES });
    });

    it('should set empty counts', () => {
      tag().onConfigure(() => null);

      expect(tag().counts).to.eql({});
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
