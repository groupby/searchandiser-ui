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

  describe('initServices()', () => {
    it('should initialize all services', () => {
      const flux: any = { on: () => null, search: () => Promise.resolve() };

      const services = initServices(flux, <any>{ customerId: 'test', area: 'other' });

      expect(services.filter).to.be.an.instanceof(Filter);
      expect(services.redirect).to.be.an.instanceof(Redirect);
      expect(services.url).to.be.an.instanceof(Url);
      expect(services.collections).to.be.an.instanceof(Collections);
    });
  });

  describe('startServices()', () => {
    it('should start services in map', () => {
      const init = sinon.spy();
      const services = { a: { init }, b: { init }, c: { init } };

      startServices(services);

      expect(init.callCount).to.eq(3);
    });
  });
});
