import { ListItem } from '../../../src/tags/list/gb-list-item';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-list-item', ListItem, ({ tag, spy, expectAliases }) => {

  describe('init()', () => {
    it('should alias item as $list.itemAlias and i as $list.indexAlias', () => {
      const item = tag().item = { a: 'b' };
      const index = tag().i = 8;
      tag().$list = <any>{
        itemAlias: 'item',
        indexAlias: 'index',
        isActive: () => null
      };

      expectAliases(() => tag().init(), { item, index });
    });

    it('should add active class if $list.isActive()', () => {
      const add = spy();
      tag().$list = <any>{ isActive: () => true };
      tag().root = <any>{ classList: { add } };

      tag().init();

      expect(add).to.have.been.calledWith('active');
    });

    it('should not add active class if not $list.isActive()', () => {
      tag().$list = <any>{ isActive: () => false };
      tag().root = <any>{ classList: { add: () => expect.fail() } };

      tag().init();
    });

    it('should unalias() $list', () => {
      const unalias = tag().unalias = spy();
      tag().$list = <any>{ isActive: () => null };

      tag().init();

      expect(unalias).to.have.been.calledWith('list');
    });
  });
});
