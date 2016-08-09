import { FluxCapacitor, Events } from 'groupby-api';
import { Refinement, AvailableRefinement, SelectedRefinement } from '../../src/tags/navigation/gb-refinement';
import { displayRefinement, toRefinement } from '../../src/utils';
import { expect } from 'chai';

describe('gb-refinement logic', () => {

  let flux: FluxCapacitor;

  beforeEach(() => flux = new FluxCapacitor(''));

  describe('generic refinement logic', () => {
    let refinement: Refinement;
    beforeEach(() => refinement = Object.assign(new Refinement(), {
      flux, opts: {}
    }));

    it('should have default values', () => {
      refinement.init();

      expect(refinement.toView).to.eq(displayRefinement);
      expect(refinement.toRefinement).to.eq(toRefinement);
    });
  });

  describe('gb-available-refinement logic', () => {
    let refinement: AvailableRefinement;
    beforeEach(() => refinement = Object.assign(new AvailableRefinement(), {
      flux, opts: {}
    }));

    it('should make refinement', () => {
      flux.refine = (ref): any => expect(ref).to.eql({
        navigationName: 'price',
        type: 'Range',
        low: 4,
        high: 6
      });

      refinement.ref = { type: 'Range', low: 4, high: 6 };
      refinement.nav = { name: 'price' };
      refinement.init();

      refinement.send();
    });
  });

  describe('gb-selected-refinement logic', () => {
    let refinement: SelectedRefinement;
    beforeEach(() => refinement = Object.assign(new SelectedRefinement(), {
      flux, opts: {}
    }));

    it('should remove refinement', () => {
      flux.unrefine = (ref): any => expect(ref).to.eql({
        navigationName: 'price',
        type: 'Range',
        low: 4,
        high: 6
      });

      refinement.ref = { type: 'Range', low: 4, high: 6 };
      refinement.nav = { name: 'price' };
      refinement.init();

      refinement.remove();
    });
  });
});
