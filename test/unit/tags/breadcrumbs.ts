import { Breadcrumbs, META } from '../../../src/tags/breadcrumbs/gb-breadcrumbs';
import * as utils from '../../../src/utils/common';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-breadcrumbs', Breadcrumbs, ({
  flux, tag, spy, stub,
  expectSubscriptions,
  itShouldHaveMeta,
  itShouldAlias
}) => {
  itShouldHaveMeta(Breadcrumbs, META);

  describe('init()', () => {
    itShouldAlias(['breadcrumbs', 'listable']);

    it('should mixin toView()', () => {
      const mixin = tag().mixin = spy();

      tag().init();

      expect(mixin).to.be.calledWith({ toView: utils.displayRefinement });
    });

    it('should listen for events', () => {
      expectSubscriptions(() => tag().init(), {
        [Events.RESULTS]: tag().updateQueryState,
        [Events.RESET]: tag().clearRefinements
      });
    });
  });

  describe('clearRefinements()', () => {
    it('should update refinements with empty array', () => {
      const update = tag().update = spy();
      tag().clearRefinements();

      expect(update).to.be.calledWith({ items: [] });
    });
  });

  describe('updateQueryState()', () => {
    it('should update originalQuery', () => {
      const originalQuery = 'red sneakers';
      const update = tag().update = spy();

      tag().updateQueryState(<any>{ originalQuery });

      expect(update).to.be.calledWith({
        items: undefined,
        originalQuery,
        correctedQuery: undefined
      });
    });

    it('should update refinements', () => {
      const selectedNavigation = ['a', 'b', 'c'];
      const update = tag().update = spy();

      tag().updateQueryState(<any>{ selectedNavigation });

      expect(update).to.be.calledWith({
        items: selectedNavigation,
        originalQuery: undefined,
        correctedQuery: undefined
      });
    });

    it('should update correctedQuery', () => {
      const correctedQuery = 'tylenol';
      const update = tag().update = spy();

      tag().updateQueryState(<any>{ correctedQuery });

      expect(update).to.be.calledWith({
        items: undefined,
        originalQuery: undefined,
        correctedQuery
      });
    });

    it('should update the whole query state', () => {
      const originalQuery = 'tylenolt';
      const items = ['a', 'b', 'c'];
      const correctedQuery = 'tylenol';
      const queryState: any = { originalQuery, correctedQuery, selectedNavigation: items };
      const update = tag().update = spy();

      tag().updateQueryState(<any>queryState);

      expect(update).to.be.calledWith({ originalQuery, correctedQuery, items });
    });
  });

  describe('remove()', () => {
    it('should call flux.unrefine() with a converted refinement', () => {
      const refinement = { a: 'b' };
      const navigation = { c: 'd' };
      const constructedRefinement = { e: 'f' };
      const unrefine = stub(flux(), 'unrefine');
      const toRefinement = stub(utils, 'toRefinement').returns(constructedRefinement);

      tag().remove(refinement, navigation);

      expect(toRefinement).to.be.calledWith(refinement, navigation);
      expect(unrefine).to.be.calledWith(constructedRefinement);
    });
  });
});
