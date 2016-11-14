import { Redirect } from '../../../src/services/redirect';
import { LOCATION } from '../../../src/utils/common';
import { expectSubscriptions } from '../../utils/expectations';
import suite from './_suite';
import { expect } from 'chai';

suite('redirect', ({ stub }) => {

  describe('init()', () => {
    it('should listen for redirect events', () => {
      const flux: any = {};
      const service = new Redirect(flux);

      expectSubscriptions(() => service.init(), {
        redirect: null
      }, flux);
    });

    it('should call redirect() on redirect event', () => {
      const url = 'my-page.html';
      const flux: any = { on: (event, cb) => cb(url) };
      const service = new Redirect(flux);
      const redirect = stub(service, 'redirect');

      service.init();

      expect(redirect).to.have.been.calledWith(url);
    });
  });

  describe('redirect()', () => {
    it('should call LOCATION.assign()', () => {
      const url = 'my-page.html';
      const assign = stub(LOCATION, 'assign');
      const service = new Redirect(<any>{});

      service.redirect(url);

      expect(assign).to.have.been.calledWith(url);
    });
  });
});
