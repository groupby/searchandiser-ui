import { List } from '../../../src/tags/list/gb-list';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-list', List, ({ tag, spy }) => {

  describe('init()', () => {
    it('should alias self as list', () => {
      const alias = tag().alias = spy();

      tag().init();

      expect(alias).to.be.calledWith('list');
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

  describe('listable()', () => {
    it('should combine $listable and opts', () => {
      tag().$listable = <any>{ a: 'b' };
      tag().opts = { c: 'd' };

      expect(tag().listable()).to.eql({ a: 'b', c: 'd' });
    });
  });
});
