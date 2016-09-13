import { initServices, startServices } from '../../../src/services/init';
import { Redirect } from '../../../src/services/redirect';
import { UrlParser } from '../../../src/services/url-parser';
import { expect } from 'chai';

describe('service initialiser', () => {
  let sandbox: Sinon.SinonSandbox;

  beforeEach(() => sandbox = sinon.sandbox.create());
  afterEach(() => sandbox.restore());

  it('should initialise all services', () => {
    const flux = { on: () => null, search: () => null };
    const config = { c: 'd' };

    const services = initServices(<any>flux, <any>config);
    expect(services.redirect).to.be.an.instanceof(Redirect);
    expect(services.urlParser).to.be.an.instanceof(UrlParser);
  });

  it('should start services in map', () => {
    const spy = sinon.spy();
    const services = { a: { init: spy }, b: { init: spy }, c: { init: spy } };

    startServices(services);
    expect(spy.callCount).to.eq(3);
  });
});
