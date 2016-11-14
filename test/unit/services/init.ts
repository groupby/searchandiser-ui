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
    function Thing() {
      this.init = () => null;
      return this;
    }

    it('should initialize all services', () => {
      const flux: any = { on: () => null, search: () => Promise.resolve() };

      const services = initServices(flux, <any>{ customerId: 'test', area: 'other' });

      expect(services.filter).to.be.an.instanceof(Filter);
      expect(services.redirect).to.be.an.instanceof(Redirect);
      expect(services.url).to.be.an.instanceof(Url);
      expect(services.collections).to.be.an.instanceof(Collections);
    });

    it('should include client services', () => {
      const flux: any = { on: () => null, search: () => Promise.resolve() };

      const services: any = initServices(flux, <any>{
        customerId: 'test',
        area: 'other',
        services: { thing: Thing }
      });

      expect(services.thing).to.be.an.instanceof(Thing);
    });

    it('should override default services', () => {
      const flux: any = { on: () => null, search: () => Promise.resolve() };

      const services = initServices(flux, <any>{
        customerId: 'test',
        area: 'other',
        services: { url: Thing }
      });

      expect(services.url).to.be.an.instanceof(Thing);
    });

    it('should not override core services', () => {
      const flux: any = { on: () => null, search: () => Promise.resolve() };

      const services = initServices(flux, <any>{
        customerId: 'test',
        area: 'other',
        services: { collections: Thing }
      });

      expect(services.collections).to.be.an.instanceof(Collections);
    });

    it('should allow disabling non-core services', () => {
      const flux: any = { on: () => null, search: () => Promise.resolve() };

      const services = initServices(flux, <any>{
        customerId: 'test',
        area: 'other',
        services: { collections: false, tracker: false }
      });

      expect(services.collections).to.be.an.instanceof(Collections);
      expect(services.tracker).to.be.undefined;
    });
  });

  describe('startServices()', () => {
    it('should start services in map', () => {
      const init = sinon.spy();
      const services = { a: { init }, b: { init }, c: { init } };

      startServices(services);

      expect(init.callCount).to.eq(3);
    });

    it('should skip failed services', () => {
      const init = sinon.spy();

      startServices({ a: null, b: undefined, c: { init } });

      expect(init.callCount).to.eq(1);
    });
  });
});
