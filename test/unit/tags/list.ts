import { List } from '../../../src/tags/list/gb-list';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-list', List, ({
  tag, stub, spy,
  itShouldConfigure
}) => {

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

  });
});
