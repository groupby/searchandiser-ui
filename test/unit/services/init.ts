import { Collections } from '../../../src/services/collections';
import { Filter } from '../../../src/services/filter';
import { initServices, startServices } from '../../../src/services/init';
import { Redirect } from '../../../src/services/redirect';
import { Url } from '../../../src/services/url';
import { expect } from 'chai';

describe('service initializer', () => {
  let sandbox: Sinon.SinonSandbox;

  beforeEach(() => sandbox = sinon.sandbox.create());
  afterEach(() => sandbox.restore());

  it('should initialize all services', () => {
    const flux: any = { on: () => null, search: () => null };

    const services = initServices(flux, <any>{});
    expect(services.filter).to.be.an.instanceof(Filter);
    expect(services.redirect).to.be.an.instanceof(Redirect);
    expect(services.url).to.be.an.instanceof(Url);
    expect(services.collections).to.be.an.instanceof(Collections);
  });

  it('should start services in map', () => {
    const spy = sinon.spy();
    const services = { a: { init: spy }, b: { init: spy }, c: { init: spy } };

    startServices(services);
    expect(spy.callCount).to.eq(3);
  });
});
