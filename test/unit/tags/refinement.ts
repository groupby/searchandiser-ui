import {
  AvailableRefinement,
  Refinement,
  SelectedRefinement
} from '../../../src/tags/navigation/gb-refinement';
import { displayRefinement } from '../../../src/utils/common';
import suite from './_suite';
import { expect } from 'chai';

const TAG = 'gb-refinement';

describe(`${TAG} logic`, () => {
  const mixin = { _scopeTo: () => null };

  suite('gb-refinement', Refinement, mixin, ({ tag }) => {
    describe('init()', () => {
      it('should have default values', () => {
        tag().init();

        expect(tag().toView).to.eq(displayRefinement);
      });
    });
  });

  suite('gb-available-refinement', AvailableRefinement, mixin, ({ tag }) => {
    describe('send()', () => {
      it('should make refinement', () => {
        const refinement = tag().ref = { type: 'Range', low: 4, high: 6 };
        const navigation = tag().nav = { name: 'price' };
        const send = sinon.spy((ref, nav) => {
          expect(ref).to.eq(refinement);
          expect(nav).to.eq(navigation);
        });
        tag()._scope = { send };

        tag().send();

        expect(send.called).to.be.true;
      });
    });
  });

  suite('gb-selected-refinement', SelectedRefinement, mixin, ({ tag }) => {
    describe('remove()', () => {
      it('should remove refinement', () => {
        const refinement = tag().ref = { type: 'Range', low: 4, high: 6 };
        const navigation = tag().nav = { name: 'price' };
        const remove = sinon.spy((ref, nav) => {
          expect(ref).to.eq(refinement);
          expect(nav).to.eq(navigation);
        });
        tag()._scope = { remove };

        tag().remove();

        expect(remove.called).to.be.true;
      });
    });
  });
});
