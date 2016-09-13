import { Redirect } from '../../../src/services/redirect';
import { WINDOW } from '../../../src/utils';
import { expect } from 'chai';

describe('redirect service', () => {
  let sandbox;
  beforeEach(() => sandbox = sinon.sandbox.create());
  afterEach(() => sandbox.restore());

  it('should attach a handler for redirect events', () => {
    const redirect = 'my-page.html';
    sandbox.stub(WINDOW, 'assign', (url) => expect(url).to.eq(redirect));
    const flux = <any>{
      on: (event, cb) => {
        expect(event).to.eq('redirect');
        cb(redirect);
      }
    };

    new Redirect(flux, {}).init();
  });
});
