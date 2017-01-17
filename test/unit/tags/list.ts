import { DEFAULTS, List, TYPES } from '../../../src/tags/list/gb-list';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-list', List, ({
  tag, spy,
  itShouldAlias
}) => {

  describe('init()', () => {
    itShouldAlias('list');

    it('should call depend()', () => {
      const depend = tag().depend = sinon.spy();

      tag().init();

      expect(depend).to.be.calledWith('listable', { defaults: DEFAULTS, types: TYPES });
    });
  });

  describe('isActive()', () => {
    it('should evaluate activation', () => {
      const activation = spy(() => true);
      tag().$listable = <any>{ activation };

      expect(tag().isActive(1)).to.be.true;

      expect(activation).to.have.been.calledWith(1);
    });

    it('should default to falsy', () => {
      tag().$listable = <any>{};

      expect(tag().isActive(1)).to.not.be.ok;
    });
  });

  describe('shouldRender()', () => {
    it('should return true', () => {
      tag().$listable = <any>{};

      expect(tag().shouldRender('test')).to.be.true;
    });

    it('should return false', () => {
      tag().$listable = <any>{ shouldRender: () => false };

      expect(tag().shouldRender('test')).to.be.false;
    });
  });
});
