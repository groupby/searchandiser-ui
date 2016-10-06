import { Breadcrumbs, DEFAULT_CONFIG } from '../../../src/tags/breadcrumbs/gb-breadcrumbs';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-breadcrumbs', Breadcrumbs, ({ flux, tag }) => {

  describe('init()', () => {
    it('should configure itself with defaults', (done) => {
      tag().configure = (defaults) => {
        expect(defaults).to.eq(DEFAULT_CONFIG);
        done();
      };

      tag().init();
    });

    it('should listen for events', () => {
      flux().on = (event: string): any => {
        switch (event) {
          case Events.RESULTS:
          case Events.RESET:
            break;
          default: expect.fail();
        }
      };

      tag().init();
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

      tag().updateQueryState(<any>{});
    });
  });
});
