import { ListItem } from '../../../src/tags/list/gb-list-item';
import suite from './_suite';
import { expect } from 'chai';

suite.only('gb-list-item', ListItem, ({
  tag, stub, spy,
  expectAliases,
  itShouldConfigure
}) => {

  describe('init()', () => {

    it('should alias item as $list.itemAlias', () => {
      const item = tag().item = { a: 'b' };
      tag().$list = <any>{ itemAlias: 'item', isActive: () => null };

      expectAliases(tag().init, tag(), 'item', item);
    });

  });
});
