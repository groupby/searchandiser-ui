import {
  applyDefaultConfig,
  initCapacitor,
  initSearchandiser,
  transformConfig,
  validateConfig,
  CONFIGURATION_MASK,
  DEFAULT_URL_CONFIG,
  Searchandiser
} from '../../src/searchandiser';
import * as serviceInitialiser from '../../src/services/init';
import * as Tags from '../../src/tags/tag';
import { expect } from 'chai';
import { FluxCapacitor } from 'groupby-api';
import * as groupby from 'groupby-api';
import * as riot from 'riot';

describe('searchandiser', () => {
  let sandbox: Sinon.SinonSandbox;
  let searchandiser: Searchandiser;
  let flux;

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
      flux.emit = (event, data) => {
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

  describe('applyDefaultConfig()', () => {
    it('should set defaults', () => {
      const config = applyDefaultConfig(<any>{});

      expect(config).to.eql({ initialSearch: true, url: DEFAULT_URL_CONFIG });
    });

    it('should override defaults', () => {
      const originalConfig: any = {
        initialSearch: false,
        url: {
          queryParam: 'query',
          searchUrl: '/productSearch'
        }
      };

      const config = applyDefaultConfig(originalConfig);

      expect(config).to.eql(originalConfig);
    });
  });

  describe('transformConfig()', () => {
    it('should not modify the configuration', () => {
      const config = transformConfig(<any>{});

      expect(config).to.eql({});
    });

    it('should set the pageSize', () => {
      const config = transformConfig(<any>{ pageSizes: [5, 10, 25, 50, 100] });

      expect(config.pageSize).to.eq(5);
    });

    it('should set the default sort', () => {
      const config = transformConfig(<any>{
        tags: {
          sort: {
            options: [
              { value: { field: 'A', order: 'B' } },
              { value: { field: 'C', order: 'D' } }
            ]
          }
        }
      });

      expect(config.sort).to.eql([{ field: 'A', order: 'B' }]);
    });

    describe('bridge configuration', () => {
      it('should not remove the bridge configuration', () => {
        const config = transformConfig(<any>{ bridge: {} });

        expect(config.bridge).to.be.ok;
      });

      it('should accept HTTPS', () => {
        const config = transformConfig(<any>{ bridge: { https: true } });

        expect(config.bridge.https).to.be.true;
      });

      it('should accept headers', () => {
        const headers = {
          These: 'Are',
          My: 'Headers'
        };

        const config = transformConfig(<any>{ bridge: { headers } });
        expect(config.bridge.headers).to.eq(headers);
      });

      it('should set configured headers', () => {
        const config = transformConfig(<any>{
          bridge: {
            skipCache: true,
            skipSemantish: true
          }
        });

        expect(config.bridge.headers).to.eql({
          'Skip-Caching': true,
          'Skip-Semantish': true
        });
      });

      it('should merge headers', () => {
        const config = transformConfig(<any>{
          bridge: {
            headers: { Some: 'Headers' },
            skipCache: true
          }
        });

        expect(config.bridge.headers).to.eql({
          Some: 'Headers',
          'Skip-Caching': true
        });
      });

      it('should not clobber timeout', () => {
        const config = transformConfig(<any>{ bridge: { timeout: 1300 } });

        expect(config.bridge.timeout).to.eq(1300);
      });
    });
  });

  describe('initSearchandiser()', () => {
    it('should generate a configuration function', () => {
      const fluxMixin = { a: 'b', c: 'd' };
      const structure = { title: 't', price: 'p' };
      const mixinStub = sandbox.stub(riot, 'mixin', (mixin) => expect(mixin).to.eq(fluxMixin));
      const initServices = sandbox.stub(serviceInitialiser, 'initServices', (fluxInstance, config) => {
        expect(fluxInstance).to.be.an.instanceof(FluxCapacitor);
        expect(config).to.eql({ initialSearch: true, url: DEFAULT_URL_CONFIG, structure });
      });
      sandbox.stub(Tags, 'MixinFlux', () => fluxMixin);

      const configure = initSearchandiser();
      expect(configure).to.be.a('function');

      configure({ structure });

      expect(configure['flux']).to.be.an.instanceof(FluxCapacitor);
      expect(configure['config']).to.eql({ initialSearch: true, url: DEFAULT_URL_CONFIG, structure });
      expect(mixinStub.called).to.be.true;
      expect(initServices.called).to.be.true;
    });
  });

  describe('initCapacitor()', () => {
    it('should create a new flux capacitor', () => {
      const config = { customerId: 123, a: 'b', c: 'd' };
      const stub = sandbox.stub(groupby, 'FluxCapacitor', (customerId, configuration, mask) => {
        expect(customerId).to.eq(123);
        expect(configuration).to.eq(config);
        expect(mask).to.eq(CONFIGURATION_MASK);
      });

      initCapacitor(<any>config);

      expect(stub.called).to.be.true;
    });
  });

  describe('validateConfig()', () => {
    it('should require structure', () => {
      expect(() => validateConfig(<any>{})).to.throw('must provide a record structure');
    });

    it('should require structure.title', () => {
      const config: any = { structure: {} };

      expect(() => validateConfig(config)).to.throw('structure.title must be the path to the title field');
    });

    it('should require non-blank structure.title', () => {
      const config: any = { structure: { title: '  ' } };

      expect(() => validateConfig(config)).to.throw('structure.title must be the path to the title field');
    });

    it('should require structure.price', () => {
      const config: any = { structure: { title: 'title' } };

      expect(() => validateConfig(config)).to.throw('structure.price must be the path to the price field');
    });

    it('should require non-blank structure.price', () => {
      const config: any = { structure: { title: 'title', price: '  ' } };

      expect(() => validateConfig(config)).to.throw('structure.price must be the path to the price field');
    });

    it('should be valid', () => {
      const config: any = { structure: { title: 'title', price: 'price' } };

      expect(() => validateConfig(config)).not.to.throw();
    });

    it('should accept variant title', () => {
      const config: any = { structure: { price: 'price', _variantStructure: { title: 'title' } } };

      expect(() => validateConfig(config)).not.to.throw();
    });

    it('should accept variant price', () => {
      const config: any = { structure: { title: 'title', _variantStructure: { price: 'price' } } };

      expect(() => validateConfig(config)).not.to.throw();
    });

    it('should accept variant title and price', () => {
      const config: any = { structure: { _variantStructure: { title: 'title', price: 'price' } } };

      expect(() => validateConfig(config)).not.to.throw();
    });
  });
});
