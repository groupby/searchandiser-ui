import { expect } from 'chai';
import { handleRedirect } from '../../src/handlers';

describe('handlers', () => {
  let sandbox;
  beforeEach(() => sandbox = sinon.sandbox.create());
  afterEach(() => sandbox.restore());

  it('should attach a handler for redirect events', () => {
    const redirect = 'my-page.html';
    sandbox.stub(window.location, 'assign', (url) => expect(url).to.eq(redirect));
    const flux = <any>{
      on: (event, cb) => {
        expect(event).to.eq('redirect');
        cb(redirect);
      }
    };

    handleRedirect(flux);
  });
});
