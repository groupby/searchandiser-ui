import { Redirect } from '../../../src/services/redirect';
import { LOCATION } from '../../../src/utils/common';
import { expect } from 'chai';

describe('redirect service', () => {
  let sandbox: Sinon.SinonSandbox;
  beforeEach(() => sandbox = sinon.sandbox.create());
  afterEach(() => sandbox.restore());

  it('should attach a handler for redirect events', () => {
    const redirect = 'my-page.html';
    sandbox.stub(LOCATION, 'assign', (url) => expect(url).to.eq(redirect));
    const flux: any = {
      on: (event, cb) => {
        expect(event).to.eq('redirect');
        cb(redirect);
      }
    };

    new Redirect(flux).init();
  });
});
