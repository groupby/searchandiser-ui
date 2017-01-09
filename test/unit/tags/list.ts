import { List } from '../../../src/tags/list/gb-list';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-list', List, ({ tag, spy, expectAliases }) => {

  describe('init()', () => {
    it('should alias self as list', () => {
      expectAliases(() => tag().init(), { list: tag() });
    });

    it('should call listable()', () => {
      const listable = tag().listable = spy(() => ({}));

      tag().init();

      expect(listable).to.have.been.calledOnce;
    });

    it('should set defaults', () => {
      tag().listable = () => ({});

      tag().init();

      expect(tag().inline).to.be.false;
      expect(tag().itemAlias).to.eq('item');
      expect(tag().indexAlias).to.eq('i');
    });

    it('should set properties from listable()', () => {
      const itemAlias = 'myItem';
      const indexAlias = 'index';
      tag().listable = () => ({ inline: true, itemAlias, indexAlias });

      tag().init();

      expect(tag().inline).to.be.true;
      expect(tag().itemAlias).to.eq(itemAlias);
      expect(tag().indexAlias).to.eq(indexAlias);
    });
  });

  describe('isActive()', () => {
    it('should call listable()', () => {
      const listable = tag().listable = spy(() => ({}));

      tag().isActive(1);

      expect(listable).to.have.been.calledOnce;
    });

    it('should evaluate activation', () => {
      const activation = spy(() => true);
      tag().listable = () => ({ activation });

      expect(tag().isActive(1)).to.be.true;

      expect(activation).to.have.been.calledWith(1);
    });

    it('should default to falsy', () => {
      tag().listable = () => ({});

      expect(tag().isActive(1)).to.not.be.ok;
    });
  });

  describe('shouldRender()', () => {
    it('should return true', () => {
      tag().listable = () => ({});

      expect(tag().shouldRender('test')).to.be.true;
    });

    it('should return false', () => {
      tag().listable = () => ({ shouldRender: () => false });

      expect(tag().shouldRender('test')).to.be.false;
    });
  });

  describe('listable()', () => {
    it('should combine $listable and opts', () => {
      tag().$listable = <any>{ a: 'b' };
      tag().opts = { c: 'd' };

      expect(tag().listable()).to.eql({ a: 'b', c: 'd' });
    });
  });
});
