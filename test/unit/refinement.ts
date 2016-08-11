import { FluxCapacitor, Events } from 'groupby-api';
import { fluxTag } from '../utils/tags';
import { Refinement, AvailableRefinement, SelectedRefinement } from '../../src/tags/navigation/gb-refinement';
import { displayRefinement, toRefinement } from '../../src/utils';
import { expect } from 'chai';

describe('gb-refinement logic', () => {

  let flux: FluxCapacitor;

  beforeEach(() => flux = new FluxCapacitor(''));

  describe('generic refinement logic', () => {
    let tag: Refinement;
    beforeEach(() => ({ tag, flux } = fluxTag(new Refinement())));

    it('should have default values', () => {
      tag.init();

      expect(tag.toView).to.eq(displayRefinement);
      expect(tag.toRefinement).to.eq(toRefinement);
    });
  });

  describe('gb-available-refinement logic', () => {
    let tag: AvailableRefinement;
    beforeEach(() => ({ tag, flux } = fluxTag(new AvailableRefinement())));

    it('should make refinement', () => {
      flux.refine = (ref): any => expect(ref).to.eql({
        navigationName: 'price',
        type: 'Range',
        low: 4,
        high: 6
      });

      tag.ref = { type: 'Range', low: 4, high: 6 };
      tag.nav = { name: 'price' };
      tag.init();

      tag.send();
    });
  });

  describe('gb-selected-refinement logic', () => {
    let tag: SelectedRefinement;
    beforeEach(() => ({ tag, flux } = fluxTag(new SelectedRefinement())));

    it('should remove refinement', () => {
      flux.unrefine = (ref): any => expect(ref).to.eql({
        navigationName: 'price',
        type: 'Range',
        low: 4,
        high: 6
      });

      tag.ref = { type: 'Range', low: 4, high: 6 };
      tag.nav = { name: 'price' };
      tag.init();

      tag.remove();
    });
  });
});
