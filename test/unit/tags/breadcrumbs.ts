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
      tag().updateRefinements = (refinements) => expect(refinements).to.eql([]);

      tag().clearRefinements();
    });
  });

  describe('updateQueryState()', () => {
    it('should call updateQuery()', (done) => {
      const originalQuery = 'red sneakers';

      tag().updateQuery = (newQuery) => {
        expect(newQuery).to.eq(originalQuery);
        done();
      };

      tag().updateQueryState(<any>{ originalQuery });
    });

    it('should call updateRefinements', () => {
      const selectedNavigation = ['a', 'b', 'c'];
      tag().updateQuery = () => null;
      tag().updateRefinements = (selected) => expect(selected).to.eql(selectedNavigation);

      tag().updateQueryState(<any>{ selectedNavigation });
    });
  });

  describe('updateRefinements()', () => {
    it('should call update with selected', () => {
      const refinements = [{ a: 'b' }];
      tag().update = ({ selected }) => expect(selected).to.eq(refinements);

      tag().updateRefinements(refinements);
    });
  });

  describe('updateQuery()', () => {
    it('should call update() with originalQuery', () => {
      const query = 'leather belt';
      tag().update = ({ originalQuery }) => expect(originalQuery).to.eq(query);

      tag().updateQuery(query);
    });
  });

  describe('remove()', () => {
    it('should call flux.unrefine() with a converted refinement', () => {
      const refinement = { a: 'b' };
      const navigation = { c: 'd' };
      const constructedRefinement = { e: 'f' };
      sandbox().stub(utils, 'toRefinement', (ref, nav) => {
        expect(ref).to.eq(refinement);
        expect(nav).to.eq(navigation);
        return constructedRefinement;
      });
      flux().unrefine = (ref): any => expect(ref).to.eq(constructedRefinement);

      tag().remove(refinement, navigation);
    });
  });
});
