import { Redirect } from '../../../src/services/redirect';
import { LOCATION } from '../../../src/utils/common';
import { expectSubscriptions } from '../../utils/expectations';
import { expect } from 'chai';

describe('redirect service', () => {
  let sandbox: Sinon.SinonSandbox;

  beforeEach(() => sandbox = sinon.sandbox.create());
  afterEach(() => sandbox.restore());

  describe('init()', () => {
    it('should listen for redirect events', () => {
      const flux: any = {};
      const service = new Redirect(flux);

      expectSubscriptions(() => service.init(), {
        ['redirect']: null
      }, flux);
    });

    it('should call redirect() on redirect event', () => {
      const url = 'my-page.html';
      const flux: any = { on: (event, cb) => cb(url) };
      const service = new Redirect(flux);
      const redirect = sandbox.stub(service, 'redirect');

      service.init();

      expect(redirect.calledWith(url)).to.be.true;
    });
  });

  describe('redirect()', () => {
    it('should call LOCATION.assign()', () => {
      const url = 'my-page.html';
      const assign = sandbox.stub(LOCATION, 'assign');
      const service = new Redirect(<any>{});

      service.redirect(url);

      expect(assign.calledWith(url)).to.be.true;
    });
  });
});
