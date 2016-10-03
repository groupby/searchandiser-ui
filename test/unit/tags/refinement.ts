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
    it('should have default values', () => {
      tag().init();

      expect(tag().toView).to.eq(displayRefinement);
    });
  });

  suite('gb-available-refinement', AvailableRefinement, mixin, ({ tag }) => {
    it('should make refinement', () => {
      tag().ref = { type: 'Range', low: 4, high: 6 };
      tag().nav = { name: 'price' };
      tag()._scope = {
        send(ref: any, nav: any) {
          expect(ref).to.eq(tag().ref);
          expect(nav).to.eq(tag().nav);
        }
      };
      tag().init();

      tag().send();
    });
  });

  suite('gb-selected-refinement', SelectedRefinement, mixin, ({ flux, tag }) => {
    it('should remove refinement', () => {
      flux().unrefine = (ref): any => expect(ref).to.eql({
        navigationName: 'price',
        type: 'Range',
        low: 4,
        high: 6
      });

      tag().ref = { type: 'Range', low: 4, high: 6 };
      tag().nav = { name: 'price' };
      tag()._scope = {
        remove(ref: any, nav: any) {
          expect(ref).to.eq(tag().ref);
          expect(nav).to.eq(tag().nav);
        }
      };
      tag().init();

      tag().remove();
    });
  });
});
