import { initSearchandiser, Searchandiser } from '../../src/searchandiser';
import * as serviceInitialiser from '../../src/services/init';
import * as configuration from '../../src/utils/configuration';
import * as TagUtils from '../../src/utils/tag';
import { expect } from 'chai';
import { Events, FluxCapacitor } from 'groupby-api';
import * as groupby from 'groupby-api';
import * as riot from 'riot';

describe('searchandiser', () => {
  let sandbox: Sinon.SinonSandbox;
  let searchandiser: Searchandiser;
  let flux: FluxCapacitor;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    searchandiser = Object.assign(new Searchandiser(), {
      flux: flux = new FluxCapacitor(''),
      config: {}
    });
  });

  afterEach(() => sandbox.restore());

  describe('init()', () => {
    it('should perform an initial search', (done) => {
      searchandiser.config = <any>{ initialSearch: true };
      searchandiser.search = () => done();

      searchandiser.init();
    });

    it('should not perform an initial search', () => {
      searchandiser.config = <any>{ initialSearch: false };
      searchandiser.search = (): any => expect.fail();

      searchandiser.init();
    });
  });

  describe('attach()', () => {
    it('should mount tag with full name', () => {
      const tagName = 'gb-my-tag';
      const mount = sandbox.stub(riot, 'mount');

      const tags = searchandiser.attach(tagName);

      expect(tags).to.be.null;
      expect(mount).to.be.calledWith(tagName, {});
    });

    it('should mount tag with custom name', () => {
      const tagName = 'my-tag';
      const mount = sandbox.stub(riot, 'mount');

      searchandiser.attach(tagName);

      expect(mount).to.be.calledWith(tagName);
    });

    it('should mount tag with simple name', () => {
      const mount = sandbox.stub(riot, 'mount');
      searchandiser.config.simpleAttach = true;

      searchandiser.attach('my-tag');

      expect(mount).to.be.calledWith('gb-my-tag');
    });

    it('should mount tag with opts', () => {
      const tagName = 'gb-my-tag';
      const options = { a: 'b', c: 'd' };
      const mount = sandbox.stub(riot, 'mount');

      searchandiser.attach(tagName, options);

      expect(mount).to.be.calledWith(tagName, options);
    });

    it('should mount with CSS selector', () => {
      const tagName = 'gb-my-tag';
      const css = '.gb-my.tag';
      const mount = sandbox.stub(riot, 'mount');

      searchandiser.attach(tagName, css);

      expect(mount).to.be.calledWith(css, tagName);
    });

    it('should pass options with CSS selector', () => {
      const options = { a: 'b', c: 'd' };
      const mount = sandbox.stub(riot, 'mount');

      searchandiser.attach('gb-my-tag', '.gb-my.tag', options);

      expect(mount).to.be.calledWith(sinon.match.any, sinon.match.any, options);
    });

    it('should return a single tag', () => {
      const myTag = { a: 'b', c: 'd' };
      sandbox.stub(riot, 'mount').returns([myTag]);

      const tag = searchandiser.attach('gb-my-tag');

      expect(tag).to.eq(myTag);
    });

    it('should return a tag array', () => {
      const myTags = [{ a: 'b' }, { c: 'd' }];
      sandbox.stub(riot, 'mount').returns(myTags);

      const tags = searchandiser.attach('gb-my-tag');
      expect(tags).to.eq(myTags);
    });
  });

  describe('compile()', () => {
    it('should call riot.compile()', (done) => {
      sandbox.stub(riot, 'compile', () => done());

      searchandiser.compile();
    });
  });

  describe('search()', () => {
    it('should perform a blank search', (done) => {
      const search = sandbox.stub(flux, 'search').resolves();
      const emit = sandbox.stub(flux, 'emit');

      searchandiser.search()
        .then(() => {
          expect(search).to.be.calledWith(undefined);
          expect(emit).to.be.calledWith('page_changed', { pageNumber: 1, finalPage: 1 });
          done();
        });
    });

    it('should perform a search with query', () => {
      const someQuery = 'some query';
      const search = sinon.stub(flux, 'search').resolves();

      searchandiser.search(someQuery);

      expect(search).to.be.calledWith(someQuery);
    });
  });

  describe('initSearchandiser()', () => {
    it('should generate a configuration function', () => {
      const customerId = 'test';
      sandbox.stub(configuration, 'Configuration').returns({ apply: () => ({ customerId }) });
      sandbox.stub(groupby, 'FluxCapacitor').returns({ query: { withConfiguration: () => null } });
      sandbox.stub(TagUtils, 'MixinFlux').returns({});
      sandbox.stub(riot, 'mixin');
      sandbox.stub(serviceInitialiser, 'initServices').returns({ search: {} });

      const configure = initSearchandiser();

      expect(configure).to.be.a('function');
      expect(Object.keys(configure)).to.eql([]);

      configure({ customerId, structure: { title: 't', price: 'p' } });

      expect(Object.keys(configure)).to.include.members(Object.keys(Searchandiser.prototype));
    });

    it('should process the configuration on configure()', () => {
      const config: any = { a: 'b' };
      const finalConfig = { c: 'd' };
      const configurationStub = sandbox.stub(configuration, 'Configuration').returns({ apply: () => finalConfig });
      sandbox.stub(riot, 'mixin');
      sandbox.stub(serviceInitialiser, 'initServices').returns({ search: { _config: {} } });
      sandbox.stub(TagUtils, 'MixinFlux');

      const configure = initSearchandiser();
      configure(config);

      expect(configure['config']).to.eq(finalConfig);
      expect(configurationStub).to.be.calledWith(config);
    });

    it('should create a new FluxCapacitor on configure()', () => {
      const customerId = 'test';
      const withConfiguration = sinon.spy();
      const mockFlux = { query: { withConfiguration } };
      const searchandiserConfig = { c: 'd' };
      const fluxCapacitor = sandbox.stub(groupby, 'FluxCapacitor').returns(mockFlux);
      sandbox.stub(configuration, 'Configuration').returns({ apply: () => ({ customerId }) });
      sandbox.stub(serviceInitialiser, 'initServices').returns({ search: { _config: searchandiserConfig } });
      sandbox.stub(riot, 'mixin');
      sandbox.stub(TagUtils, 'MixinFlux');

      const configure = initSearchandiser();
      configure(<any>{});

      expect(configure['flux']).to.eq(mockFlux);
      expect(fluxCapacitor).to.be.calledWith(customerId);
      expect(withConfiguration).to.be.calledWith(searchandiserConfig);
    });

    it('should start the services on configure()', () => {
      const services = { search: {}} ;
      const finalConfig = { a: 'b' };
      const mockFlux = { query: { withConfiguration: () => null } };
      const initServices = sandbox.stub(serviceInitialiser, 'initServices').returns(services);
      sandbox.stub(configuration, 'Configuration').returns({ apply: () => finalConfig });
      sandbox.stub(groupby, 'FluxCapacitor').returns(mockFlux);
      sandbox.stub(riot, 'mixin');
      sandbox.stub(TagUtils, 'MixinFlux');

      const configure = initSearchandiser();
      configure(<any>{});

      expect(configure['services']).to.eq(services);
      expect(initServices).to.be.calledWith(sinon.match((param) => {
        expect(param).to.eq(mockFlux);
        return expect(param).contain.all.keys(Object.keys(Events));
      }), finalConfig);
    });

    it('should register riot mixin on configure()', () => {
      const mixed = { a: 'b' };
      const finalConfig = { c: 'd' };
      const mockFlux = { query: { withConfiguration: () => null } };
      const services = { search: {} };
      const riotMixin = sandbox.stub(riot, 'mixin');
      const fluxMixin = sandbox.stub(TagUtils, 'MixinFlux').returns(mixed);
      sandbox.stub(configuration, 'Configuration').returns({ apply: () => finalConfig });
      sandbox.stub(groupby, 'FluxCapacitor').returns(mockFlux);
      sandbox.stub(serviceInitialiser, 'initServices').returns(services);

      const configure = initSearchandiser();
      configure(<any>{ i: 'j' });

      expect(riotMixin).to.be.calledWith(mixed);
      expect(fluxMixin).to.be.calledWith(mockFlux, finalConfig, services);
    });
  });
});
