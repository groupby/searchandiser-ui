import { initServices, startServices } from '../../../src/services/init';
import { Redirect } from '../../../src/services/redirect';
import { Url } from '../../../src/services/url';
import { expect } from 'chai';

describe('service initialiser', () => {
  let sandbox: Sinon.SinonSandbox;

  beforeEach(() => sandbox = sinon.sandbox.create());
  afterEach(() => sandbox.restore());

  it('should initialise all services', () => {
    const flux: any = { on: () => null, search: () => null };
    const config: any = { url: {} };

    const services = initServices(flux, config);
    expect(services.redirect).to.be.an.instanceof(Redirect);
    expect(services.url).to.be.an.instanceof(Url);
  });

  it('should start services in map', () => {
    const spy = sinon.spy();
    const services = { a: { init: spy }, b: { init: spy }, c: { init: spy } };

    startServices(services);
    expect(spy.callCount).to.eq(3);
  });
});
