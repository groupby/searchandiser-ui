import { Collections } from '../../../src/services/collections';
import { Filter } from '../../../src/services/filter';
import { initServices, lazyMixin, startServices } from '../../../src/services/init';
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

      expect(init).to.be.calledThrice;
    });

    it('should skip failed services', () => {
      const init = sinon.spy();

      startServices({ a: null, b: undefined, c: { init } });

      expect(init).to.be.calledOnce;
    });
  });

  describe('lazyMixins()', () => {
    it('should add properties and methods', () => {
      const obj: any = {};

      lazyMixin(obj);

      expect(obj.registered).to.eql([]);
      expect(obj.register).to.be.a('function');
      expect(obj.unregister).to.be.a('function');
    });

    describe('register()', () => {
      it('should call lazyInit() on first item registered', () => {
        const lazyInit = sinon.spy();
        const obj: any = { lazyInit };
        lazyMixin(obj);

        obj.register({});
        obj.register({});

        expect(lazyInit).to.be.calledOnce;
      });

      it('should save registered tags', () => {
        const obj: any = { lazyInit: () => null };
        const tag1 = { a: 'b' };
        const tag2 = { c: 'd' };
        lazyMixin(obj);

        obj.register(tag1);
        obj.register(tag2);

        expect(obj.registered).to.eql([tag1, tag2]);
      });
    });

    describe('unregister()', () => {
      it('should remove tag from registered', () => {
        const obj: any = {};
        const tag = { a: 'b' };
        lazyMixin(obj);
        obj.registered = [tag];

        obj.unregister(tag);

        expect(obj.registered).to.eql([]);
      });

      it('should not unregister if not found', () => {
        const obj: any = {};
        lazyMixin(obj);
        obj.registered = [{ a: 'b' }];

        obj.unregister({ a: 'b' });

        expect(obj.registered).to.have.length(1);
      });
    });
  });
});
