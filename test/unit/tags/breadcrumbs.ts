import { Breadcrumbs, DEFAULT_CONFIG } from '../../../src/tags/breadcrumbs/gb-breadcrumbs';
import * as utils from '../../../src/utils/common';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-breadcrumbs', Breadcrumbs, ({
  flux, tag, sandbox,
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
      const stub = sandbox().stub(tag(), 'updateRefinements', (refinements) =>
        expect(refinements).to.eql([]));

      tag().clearRefinements();

      expect(stub.called).to.be.true;
    });
  });

  describe('updateQueryState()', () => {
    it('should call updateQuery()', () => {
      const originalQuery = 'red sneakers';
      const stub = sandbox().stub(tag(), 'updateQuery', (newQuery) =>
        expect(newQuery).to.eq(originalQuery));
      tag().updateRefinements = () => null;

      tag().updateQueryState(<any>{ originalQuery });

      expect(stub.called).to.be.true;
    });

    it('should call updateRefinements', () => {
      const selectedNavigation = ['a', 'b', 'c'];
      const stub = sandbox().stub(tag(), 'updateRefinements', (selected) =>
        expect(selected).to.eql(selectedNavigation));
      tag().updateQuery = () => null;

      tag().updateQueryState(<any>{ selectedNavigation });

      expect(stub.called).to.be.true;
    });
  });

  describe('updateRefinements()', () => {
    it('should call update with selected', () => {
      const refinements = [{ a: 'b' }];
      const spy =
        tag().update =
        sinon.spy(({ selected }) => expect(selected).to.eq(refinements));

      tag().updateRefinements(refinements);

      expect(spy.called).to.be.true;
    });
  });

  describe('updateQuery()', () => {
    it('should call update() with originalQuery', () => {
      const query = 'leather belt';
      const spy =
        tag().update =
        sinon.spy(({ originalQuery }) => expect(originalQuery).to.eq(query));

      tag().updateQuery(query);

      expect(spy.called).to.be.true;
    });
  });

  describe('remove()', () => {
    it('should call flux.unrefine() with a converted refinement', () => {
      const refinement = { a: 'b' };
      const navigation = { c: 'd' };
      const constructedRefinement = { e: 'f' };
      const stub = sandbox().stub(flux(), 'unrefine', (ref) =>
        expect(ref).to.eq(constructedRefinement));
      sandbox().stub(utils, 'toRefinement', (ref, nav) => {
        expect(ref).to.eq(refinement);
        expect(nav).to.eq(navigation);
        return constructedRefinement;
      });

      tag().remove(refinement, navigation);

      expect(stub.called).to.be.true;
    });
  });
});
