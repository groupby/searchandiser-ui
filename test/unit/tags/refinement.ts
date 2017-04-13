import { Refinement } from '../../../src/tags/navigation/gb-refinement';
import { expectAliases } from '../../utils/expectations';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-refinement', Refinement, ({ tag, spy }) => {
  describe('init()', () => {
    it('should alias refinement', () => {
      const refinement = tag().refinement = { a: 'b' };

      expectAliases(() => tag().init(), tag(), { refinement });
    });
  });

  describe('send()', () => {
    it('should make refinement', () => {
      const refinement = tag().refinement = { type: 'Range', low: 4, high: 6 };
      const navigation = tag().$navigation = { name: 'price' };
      const send = spy();
      tag().$navigable = <any>{ send };

      tag().send();

      expect(send).to.be.calledWith(refinement, navigation);
    });
  });

  describe('remove()', () => {
    it('should remove refinement', () => {
      const refinement = tag().refinement = { type: 'Range', low: 4, high: 6 };
      const navigation = tag().$navigation = { name: 'price' };
      const remove = spy();
      tag().$navigable = <any>{ remove };

      tag().remove();

      expect(remove).to.be.calledWith(refinement, navigation);
    });
  });
});
