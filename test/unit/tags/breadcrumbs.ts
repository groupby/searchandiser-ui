import { Breadcrumbs, DEFAULT_CONFIG } from '../../../src/tags/breadcrumbs/gb-breadcrumbs';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-breadcrumbs', Breadcrumbs, ({ flux, tag }) => {
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

  it('should empty selected on RESET', () => {
    flux().on = (event: string, cb: Function): any => {
      if (event === Events.RESET) cb();
    };

    tag().update = (obj: any) => expect(obj.selected.length).to.eq(0);
    tag().init();
  });

  it('should update originalQuery on RESULTS', (done) => {
    const originalQuery = 'red sneakers';

    flux().on = (event: string, cb: Function): any => {
      if (event === Events.RESULTS) cb({ originalQuery });
    };

    tag().update = (obj: any) => {
      expect(obj.originalQuery).to.eq(originalQuery);
      done();
    };
    tag().init();
  });

  it('should update selected on RESULTS', () => {
    const selectedNavigation = ['a', 'b', 'c'];

    flux().on = (event: string, cb: Function): any => {
      if (event === Events.RESULTS) cb({ selectedNavigation });
    };

    tag().updateQuery = () => null;
    tag().update = (obj: any) => expect(obj.selected).to.eql(selectedNavigation);
    tag().init();
  });
});
