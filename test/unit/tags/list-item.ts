import { ListItem } from '../../../src/tags/list/gb-list-item';
import suite from './_suite';
import { expect } from 'chai';

suite.only('gb-list-item', ListItem, ({
  tag, stub, spy,
  itShouldConfigure,
  itShouldAlias
}) => {

  describe('init()', () => {

    it('should alias item as $list.itemAlias', () => {
      const alias = tag().alias = spy();
      const item = tag().item = { a: 'b' };
      tag().$list = <any>{ itemAlias: 'item', isActive: () => null };

      tag().init();

      expect(alias).to.be.calledWith('item', item);
    });

  });
});
