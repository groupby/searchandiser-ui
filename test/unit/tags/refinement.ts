import {
  AvailableRefinement,
  Refinement,
  SelectedRefinement
} from '../../../src/tags/navigation/gb-refinement';
import { displayRefinement } from '../../../src/utils/common';
import suite from './_suite';
import { expect } from 'chai';

const TAG = 'gb-refinement';
const MIXIN = { _scopeTo: () => null };

describe(`${TAG} logic`, () => {

  suite('gb-refinement', Refinement, MIXIN, ({ tag }) => {
    describe('init()', () => {
      it('should have default values', () => {
        tag().init();

        expect(tag().toView).to.eq(displayRefinement);
      });
    });
  });

  suite('gb-available-refinement', AvailableRefinement, MIXIN, ({ tag, spy }) => {
    describe('send()', () => {
      it('should make refinement', () => {
        const refinement = tag().ref = { type: 'Range', low: 4, high: 6 };
        const navigation = tag().nav = { name: 'price' };
        const send = spy();
        tag()._scope = { send };

        tag().send();

        expect(send.calledWith(refinement, navigation)).to.be.true;
      });
    });
  });

  suite('gb-selected-refinement', SelectedRefinement, MIXIN, ({ tag, spy }) => {
    describe('remove()', () => {
      it('should remove refinement', () => {
        const refinement = tag().ref = { type: 'Range', low: 4, high: 6 };
        const navigation = tag().nav = { name: 'price' };
        const remove = spy();
        tag()._scope = { remove };

        tag().remove();

        expect(remove.calledWith(refinement, navigation)).to.be.true;
      });
    });
  });
});
