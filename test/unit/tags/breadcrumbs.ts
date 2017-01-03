import { removeRefinement, Breadcrumbs, SCHEMA } from '../../../src/tags/breadcrumbs/gb-breadcrumbs';
import * as utils from '../../../src/utils/common';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-breadcrumbs', Breadcrumbs, ({
  flux, tag, spy, stub,
  expectSubscriptions,
  itShouldSchema
}) => {

  describe('init()', () => {
    itShouldSchema(SCHEMA);

    it('should listen for events', () => {
      expectSubscriptions(() => tag().init(), {
        [Events.RESULTS]: tag().updateQueryState,
        [Events.RESET]: tag().clearRefinements
      });
    });
  });

  describe('clearRefinements()', () => {
    it('should update refinements with empty array', () => {
      const update = tag().$update = spy();
      tag().clearRefinements();

      expect(update).to.have.been.calledWith({ selected: [] });
    });
  });

  describe('updateQueryState()', () => {
    it('should update originalQuery', () => {
      const originalQuery = 'red sneakers';
      const update = tag().$update = spy();

      tag().updateQueryState(<any>{ originalQuery });

      expect(update).to.have.been.calledWith({
        originalQuery,
        selected: undefined,
        correctedQuery: undefined
      });
    });

    it('should update refinements', () => {
      const selectedNavigation = ['a', 'b', 'c'];
      const update = tag().$update = spy();

      tag().updateQueryState(<any>{ selectedNavigation });

      expect(update).to.have.been.calledWith({
        originalQuery: undefined,
        selected: selectedNavigation,
        correctedQuery: undefined
      });
    });

    it('should update correctedQuery', () => {
      const correctedQuery = 'tylenol';
      const update = tag().$update = spy();

      tag().updateQueryState(<any>{ correctedQuery });

      expect(update).to.have.been.calledWith({
        originalQuery: undefined,
        selected: undefined,
        correctedQuery
      });
    });

    it('should update the whole query state', () => {
      const originalQuery = 'tylenolt';
      const selected = ['a', 'b', 'c'];
      const correctedQuery = 'tylenol';
      const queryState: any = { originalQuery, correctedQuery, selectedNavigation: selected };
      const update = tag().$update = spy();

      tag().updateQueryState(<any>queryState);

      expect(update).to.have.been.calledWith({ originalQuery, correctedQuery, selected });
    });
  });

  describe('removeRefinement()', () => {
    it('should call flux.unrefine() with a converted refinement', () => {
      const refinement = { a: 'b' };
      const navigation = { c: 'd' };
      const constructedRefinement = { e: 'f' };
      const unrefine = stub(flux(), 'unrefine');
      const toRefinement = stub(utils, 'toRefinement').returns(constructedRefinement);

      removeRefinement.bind({
        flux: flux(),
        refinement,
        navigation
      })();

      expect(toRefinement).to.have.been.calledWith(refinement, navigation);
      expect(unrefine).to.have.been.calledWith(constructedRefinement);
    });
  });
});
