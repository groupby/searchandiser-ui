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
        tag().ref = { type: 'Range', low: 4, high: 6 };
        tag().nav = { name: 'price' };
        tag()._scope = {
          send(ref: any, nav: any) {
            expect(ref).to.eq(tag().ref);
            expect(nav).to.eq(tag().nav);
          }
        };

        tag().send();
      });
    });
  });

  suite('gb-selected-refinement', SelectedRefinement, mixin, ({ tag }) => {
    describe('remove()', () => {
      it('should remove refinement', () => {
        tag().ref = { type: 'Range', low: 4, high: 6 };
        tag().nav = { name: 'price' };
        tag()._scope = {
          remove(ref: any, nav: any) {
            expect(ref).to.eq(tag().ref);
            expect(nav).to.eq(tag().nav);
          }
        };

        tag().remove();
      });
    });
  });
});
