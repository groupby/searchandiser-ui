import { Breadcrumbs, DEFAULT_CONFIG } from '../../../src/tags/breadcrumbs/gb-breadcrumbs';
import * as utils from '../../../src/utils/common';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-breadcrumbs', Breadcrumbs, ({
  flux, tag, spy, stub,
  expectSubscriptions,
  itShouldConfigure
}) => {

  describe('init()', () => {
    itShouldConfigure(DEFAULT_CONFIG);

    it('should listen for events', () => {
      expectSubscriptions(() => tag().init(), {
        [Events.RESULTS]: tag().updateQueryState,
        [Events.RESET]: tag().clearRefinements
      });
    });
  });

  describe('clearRefinements()', () => {
    it('should update refinements with empty array', () => {
      const updateRefinements = stub(tag(), 'updateRefinements');

      tag().clearRefinements();

      expect(updateRefinements.calledWith([])).to.be.true;
    });
  });

  describe('updateQueryState()', () => {
    it('should call updateQuery()', () => {
      const originalQuery = 'red sneakers';
      const updateQuery = stub(tag(), 'updateQuery');
      tag().updateRefinements = () => null;

      tag().updateQueryState(<any>{ originalQuery });

      expect(updateQuery.calledWith(originalQuery)).to.be.true;
    });

    it('should call updateRefinements', () => {
      const selectedNavigation = ['a', 'b', 'c'];
      const updateRefinements = stub(tag(), 'updateRefinements');
      tag().updateQuery = () => null;

      tag().updateQueryState(<any>{ selectedNavigation });

      expect(updateRefinements.calledWith(selectedNavigation)).to.be.true;
    });
  });

  describe('updateRefinements()', () => {
    it('should call update with selected', () => {
      const selected = [{ a: 'b' }];
      const update = tag().update = spy();

      tag().updateRefinements(selected);

      expect(update.calledWith({ selected })).to.be.true;
    });
  });

  describe('updateQuery()', () => {
    it('should call update() with originalQuery', () => {
      const originalQuery = 'leather belt';
      const update = tag().update = spy();

      tag().updateQuery(originalQuery);

      expect(update.calledWith({ originalQuery })).to.be.true;
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

      expect(toRefinement.calledWith(refinement, navigation)).to.be.true;
      expect(unrefine.calledWith(constructedRefinement)).to.be.true;
    });
  });
});
