import { initSearchandiser, CONFIGURATION_MASK, Searchandiser } from '../../src/searchandiser';
import * as serviceInitialiser from '../../src/services/init';
import * as Tags from '../../src/tags/tag';
import * as configuration from '../../src/utils/configuration';
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

  describe('attach logic', () => {
    it('should mount tag with full name', () => {
      const tagName = 'gb-my-tag';
      const stub = sandbox.stub(riot, 'mount', (tag, opts) => {
        expect(tag).to.eq(tagName);
        expect(opts).to.eql({});
      });

      const tags = searchandiser.attach(tagName);

      expect(tags).to.be.null;
      expect(stub.called).to.be.true;
    });

    it('should mount tag with simple name', () => {
      const stub = sandbox.stub(riot, 'mount', (tag) => expect(tag).to.eq('gb-my-tag'));

      searchandiser.attach('my-tag');

      expect(stub.called).to.be.true;
    });

    it('should mount tag with opts', () => {
      const tagName = 'gb-my-tag';
      const options = { a: 'b', c: 'd' };
      const stub = sandbox.stub(riot, 'mount', (tag, opts) => expect(opts).to.eq(options));

      searchandiser.attach(tagName, options);

      expect(stub.called).to.be.true;
    });

    it('should mount with CSS selector', () => {
      const tagName = 'gb-my-tag';
      const css = '.gb-my.tag';
      const stub = sandbox.stub(riot, 'mount', (cssSelector, tag, opts) => {
        expect(cssSelector).to.eq(css);
        expect(tag).to.eq(tagName);
      });

      searchandiser.attach(tagName, css);

      expect(stub.called).to.be.true;
    });

    it('should pass options with CSS selector', () => {
      const options = { a: 'b', c: 'd' };
      const stub = sandbox.stub(riot, 'mount', (tag, cssSelector, opts) => expect(opts).to.eql(options));

      searchandiser.attach('gb-my-tag', '.gb-my.tag', options);

      expect(stub.called).to.be.true;
    });

    it('should return a single tag', () => {
      const myTag = { a: 'b', c: 'd' };
      sandbox.stub(riot, 'mount').returns([myTag]);

      const tag = searchandiser.attach('gb-my-tag');

      expect(tag).to.eq(myTag);
    });

    it('should return a tag array', () => {
      const myTags = [{ a: 'b' }, { c: 'd' }];
      sandbox.stub(riot, 'mount')
        .returns(myTags);

      const tags = searchandiser.attach('gb-my-tag');
      expect(tags).to.eq(myTags);
    });
  });

  it('should call riot.compile()', (done) => {
    sandbox.stub(riot, 'compile', () => done());

    searchandiser.compile();
  });

  describe('search()', () => {
    it('should perform a blank search', (done) => {
      const stub = sandbox.stub(flux, 'search', (query) =>
        Promise.resolve(expect(query).to.be.undefined));
      flux.emit = (event, data): any => {
        expect(event).to.eq('page_changed');
        expect(data).to.eql({ pageNumber: 1, finalPage: 1 });
        expect(stub.called).to.be.true;
        done();
      };

      searchandiser.search();
    });

    it('should perform a search with query', () => {
      const someQuery = 'some query';
      const stub = sinon.stub(flux, 'search', (query) => Promise.resolve(expect(query).to.eq(someQuery)));

      searchandiser.search(someQuery);

      expect(stub.called).to.be.true;
    });
  });

  describe('initSearchandiser()', () => {
    it('should generate a configuration function', () => {
      const fluxMixin = { a: 'b', c: 'd' };
      const customerId = 'test';
      const structure = { title: 't', price: 'p' };
      const config: any = { customerId, structure };
      const finalConfig = { customerId, e: 'f' };
      const mockFlux = { g: 'h' };
      sandbox.stub(configuration, 'Configuration').returns({ apply: () => finalConfig });
      sandbox.stub(groupby, 'FluxCapacitor').returns(mockFlux);
      sandbox.stub(riot, 'mixin');
      sandbox.stub(serviceInitialiser, 'initServices');
      sandbox.stub(Tags, 'MixinFlux', () => fluxMixin);

      const configure = initSearchandiser();
      expect(configure).to.be.a('function');
      expect(Object.keys(configure)).to.eql([]);

      configure(config);

      expect(Object.keys(configure)).to.include.members(Object.keys(Searchandiser.prototype));
    });

    it('should process the configuration on configure()', () => {
      const config: any = { a: 'b' };
      const finalConfig = { c: 'd' };
      const configurationStub = sandbox.stub(configuration, 'Configuration').returns({ apply: () => finalConfig });
      sandbox.stub(riot, 'mixin');
      sandbox.stub(serviceInitialiser, 'initServices');
      sandbox.stub(Tags, 'MixinFlux');

      const configure = initSearchandiser();
      configure(config);

      expect(configure['config']).to.eq(finalConfig);
      expect(configurationStub.calledWith(config)).to.be.true;
    });

    it('should create a new FluxCapacitor on configure()', () => {
      const customerId = 'test';
      const finalConfig = { customerId, e: 'f' };
      const mockFlux = { g: 'h' };
      const fluxCapacitor = sandbox.stub(groupby, 'FluxCapacitor').returns(mockFlux);
      sandbox.stub(serviceInitialiser, 'initServices');
      sandbox.stub(configuration, 'Configuration').returns({ apply: () => finalConfig });
      sandbox.stub(riot, 'mixin');
      sandbox.stub(Tags, 'MixinFlux');

      const configure = initSearchandiser();
      configure(<any>{ a: 'b' });

      expect(configure['flux']).to.eq(mockFlux);
      expect(fluxCapacitor.calledWith(customerId, finalConfig, CONFIGURATION_MASK)).to.be.true;
    });

    it('should start the services on configure()', () => {
      const services = { a: 'b' };
      const finalConfig = { c: 'd' };
      sandbox.stub(serviceInitialiser, 'initServices', (fluxInstance, cfg) => {
        expect(fluxInstance).to.be.an.instanceof(FluxCapacitor);
        expect(fluxInstance).to.have.all.keys(Object.keys(Events));
        expect(cfg).to.eql(finalConfig);
        return services;
      });
      sandbox.stub(configuration, 'Configuration').returns({ apply: () => finalConfig });
      sandbox.stub(groupby, 'FluxCapacitor');
      sandbox.stub(riot, 'mixin');
      sandbox.stub(Tags, 'MixinFlux');

      const configure = initSearchandiser();
      configure(<any>{ e: 'f' });

      expect(configure['services']).to.eq(services);
    });

    it('should register riot mixin on configure()', () => {
      const mixed = { a: 'b' };
      const finalConfig = { c: 'd' };
      const mockFlux = { e: 'f' };
      const services = { g: 'h' };
      const riotMixin = sandbox.stub(riot, 'mixin');
      const fluxMixin = sandbox.stub(Tags, 'MixinFlux', () => mixed);
      sandbox.stub(configuration, 'Configuration').returns({ apply: () => finalConfig });
      sandbox.stub(groupby, 'FluxCapacitor').returns(mockFlux);
      sandbox.stub(serviceInitialiser, 'initServices').returns(services);

      const configure = initSearchandiser();
      configure(<any>{ i: 'j' });

      expect(riotMixin.calledWith(mixed)).to.be.true;
      expect(fluxMixin.calledWith(mockFlux, finalConfig, services)).to.be.true;
    });
  });
});
