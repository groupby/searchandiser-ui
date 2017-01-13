import { LinkList } from '../../../src/tags/link-list/gb-link-list';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-link-list', LinkList, ({ tag, spy, expectAliases, expectSubscriptions }) => {

  describe('init()', () => {
    it('should alias linkable() as $listable', () => {
      const linkable = { a: 'b' };
      tag().linkable = () => linkable;

      expectAliases(() => tag().init(), { listable: linkable });
    });

    it('should listen for update event', () => {
      expectSubscriptions(() => tag().init(), { update: tag().updateListable }, tag());
    });
  });

  describe('updateLinkable()', () => {
    it('should call linkable() with $listable', () => {
      const linkable = tag().linkable = spy();
      const listable = tag().$listable = <any>{ a: 'b' };

      tag().updateListable();

      expect(linkable).to.have.been.calledWith(listable);
    });
  });

  describe('linkable()', () => {
    it('should mix $linkable and opts', () => {
      tag().opts = { a: 'b' };
      tag().$linkable = <any>{ a: 'n', c: 'd' };

      const linkable = tag().linkable();

      expect(linkable).to.eql({ a: 'b', c: 'd' });
    });

    it('should mix into target', () => {
      const target = {};
      tag().opts = { a: 'b' };
      tag().$linkable = <any>{ c: 'd' };

      const linkable = tag().linkable(target);

      expect(linkable).to.eq(target);
      expect(target).to.eql({ a: 'b', c: 'd' });
    });
  });
});
