import {
  AvailableRefinement,
  Refinement,
  SelectedRefinement
} from '../../../src/tags/navigation/gb-refinement';
import { displayRefinement } from '../../../src/utils/common';
import { expectAliases } from '../../utils/expectations';
import suite from './_suite';
import { expect } from 'chai';

const TAG = 'gb-refinement';
const MIXIN = { _scopeTo: () => null };

describe(`${TAG} logic`, () => {

  suite('gb-refinement', Refinement, MIXIN, ({ tag }) => {
    describe('init()', () => {
      it('should alias refinement', () => {
        const refinement = tag().refinement = { a: 'b' };

        expectAliases(() => tag().init(), tag(), { refinement });
      });
    });
  });

  suite('gb-available-refinement', AvailableRefinement, MIXIN, ({ tag, spy }) => {
    describe('send()', () => {
      it('should make refinement', () => {
        const refinement = tag().refinement = { type: 'Range', low: 4, high: 6 };
        const navigation = tag().$navigation = { name: 'price' };
        const send = spy();
        tag().$navigable = <any>{ send };

        tag().send();

        expect(send).to.have.been.calledWith(refinement, navigation);
      });
    });
  });

  suite('gb-selected-refinement', SelectedRefinement, MIXIN, ({ tag, spy }) => {
    describe('remove()', () => {
      it('should remove refinement', () => {
        const refinement = tag().refinement = { type: 'Range', low: 4, high: 6 };
        const navigation = tag().$navigation = { name: 'price' };
        const remove = spy();
        tag().$navigable = <any>{ remove };

        tag().remove();

        expect(remove).to.have.been.calledWith(refinement, navigation);
      });
    });
  });
});
