import { Configuration, DEFAULT_CONFIG } from '../../../src/utils/configuration';
import { expect } from 'chai';

describe('Configuration', () => {
  let sandbox: Sinon.SinonSandbox;

  beforeEach(() => sandbox = sinon.sandbox.create());
  afterEach(() => sandbox.restore());

  describe('apply()', () => {
    const RAW_CONFIG: any = { a: 'b' };
    let configuration: Configuration;

    beforeEach(() => configuration = new Configuration(RAW_CONFIG));

    it('should return defaults in unspecified', () => {
      const config: any = { structure: { title: 'title', price: 'price' } };
      const transformed = new Configuration(config).apply();

      expect(transformed.sort).to.eql([]);
      expect(transformed.pageSize).to.eq(10);
    });

    it('should validate() rawConfig', () => {
      const validate = sandbox.stub(Configuration, 'validate');
      sandbox.stub(Configuration, 'applyDefaults');
      sandbox.stub(Configuration, 'transform');

      configuration.apply();

      expect(validate).to.be.calledWith(RAW_CONFIG);
    });

    it('should applyDefaults() to rawConfig', () => {
      const applyDefaults = sandbox.stub(Configuration, 'applyDefaults');
      sandbox.stub(Configuration, 'validate');
      sandbox.stub(Configuration, 'transform');

      configuration.apply();

      expect(applyDefaults).to.be.calledWith(RAW_CONFIG, DEFAULT_CONFIG);
    });

    it('should transform() config and return it', () => {
      const config: any = { a: 'b' };
      const transformed = { c: 'd' };
      const transform = sandbox.stub(Configuration, 'transform').returns(transformed);
      sandbox.stub(Configuration, 'applyDefaults').returns(config);
      sandbox.stub(Configuration, 'validate');

      const result = configuration.apply();

      expect(result).to.eq(transformed);
      expect(transform).to.be.calledWith(config, configuration.handlers);
    });
  });

  describe('static', () => {
    describe('validate()', () => {
      it('should require structure', () => {
        expect(() => Configuration.validate(<any>{})).to.throw('must provide a record structure');
      });

      it('should require structure.title', () => {
        const config: any = { structure: {} };

        expect(() => Configuration.validate(config)).to.throw('structure.title must be the path to the title field');
      });

      it('should require non-blank structure.title', () => {
        const config: any = { structure: { title: '  ' } };

        expect(() => Configuration.validate(config)).to.throw('structure.title must be the path to the title field');
      });

      it('should require structure.price', () => {
        const config: any = { structure: { title: 'title' } };

        expect(() => Configuration.validate(config)).to.throw('structure.price must be the path to the price field');
      });

      it('should require non-blank structure.price', () => {
        const config: any = { structure: { title: 'title', price: '  ' } };

        expect(() => Configuration.validate(config)).to.throw('structure.price must be the path to the price field');
      });

      it('should be valid', () => {
        const config: any = { structure: { title: 'title', price: 'price' } };

        expect(() => Configuration.validate(config)).not.to.throw();
      });

      it('should accept variant title', () => {
        const config: any = { structure: { price: 'price', _variantStructure: { title: 'title' } } };

        expect(() => Configuration.validate(config)).not.to.throw();
      });

      it('should accept variant price', () => {
        const config: any = { structure: { title: 'title', _variantStructure: { price: 'price' } } };

        expect(() => Configuration.validate(config)).not.to.throw();
      });

      it('should accept variant title and price', () => {
        const config: any = { structure: { _variantStructure: { title: 'title', price: 'price' } } };

        expect(() => Configuration.validate(config)).not.to.throw();
      });
    });

    describe('applyDefaults()', () => {
      it('should set defaults', () => {
        const config = Configuration.applyDefaults(<any>{}, DEFAULT_CONFIG);

        expect(config).to.eql(DEFAULT_CONFIG);
      });

      it('should override defaults', () => {
        const originalConfig: any = {
          sort: [{ field: '_relevance'}],
          pageSize: 20,
          initialSearch: false,
          simpleAttach: false,
          url: {
            queryParam: 'query',
            searchUrl: '/productSearch'
          }
        };

        const config = Configuration.applyDefaults(originalConfig, DEFAULT_CONFIG);

        expect(config).to.eql(originalConfig);
      });

      it('should handle arrays', () => {
        const pageSizes = [14, 20, 30];
        const originalConfig: any = { pageSizes };

        const config = Configuration.applyDefaults(originalConfig, DEFAULT_CONFIG);

        expect(config.pageSizes).to.eq(pageSizes);
      });
    });

    describe('transform()', () => {
      it('should not modify the configuration', () => {
        const config = Configuration.transform(<any>{}, {});

        expect(config).to.eql({});
      });

      it('should set the pageSize', () => {
        const rawConfig: any = { pageSizes: [5, 10, 25, 50, 100] };

        const config = Configuration.transform(rawConfig, new Configuration(rawConfig).handlers);

        expect(config.pageSize).to.eq(5);
      });

      it('should set the default sort', () => {
        const rawConfig: any = {
          tags: {
            sort: {
              items: [
                { value: { field: 'A', order: 'B' } },
                { value: { field: 'C', order: 'D' } }
              ]
            }
          }
        };

        const config = Configuration.transform(rawConfig, new Configuration(rawConfig).handlers);

        expect(config.sort).to.eql([{ field: 'A', order: 'B' }]);
      });

      describe('bridge configuration', () => {
        it('should not remove the bridge configuration', () => {
          const rawConfig: any = { bridge: {} };

          const config = Configuration.transform(rawConfig, new Configuration(rawConfig).handlers);

          expect(config.bridge).to.be.ok;
        });

        it('should accept HTTPS', () => {
          const rawConfig: any = { bridge: { https: true } };

          const config = Configuration.transform(rawConfig, new Configuration(rawConfig).handlers);

          expect(config.bridge.https).to.be.true;
        });

        it('should accept errorHandler', () => {
          const errorHandler = () => null;
          const rawConfig: any = { bridge: { errorHandler } };

          const config = Configuration.transform(rawConfig, new Configuration(rawConfig).handlers);

          expect(config.bridge.errorHandler).to.eq(errorHandler);
        });

        it('should accept headers', () => {
          const headers = {
            These: 'Are',
            My: 'Headers'
          };
          const rawConfig: any = { bridge: { headers } };

          const config = Configuration.transform(rawConfig, new Configuration(rawConfig).handlers);

          expect(config.bridge.headers).to.eq(headers);
        });

        it('should set configured headers', () => {
          const rawConfig: any = {
            bridge: {
              skipCache: true,
              skipSemantish: true
            }
          };

          const config = Configuration.transform(rawConfig, new Configuration(rawConfig).handlers);

          expect(config.bridge.headers).to.eql({
            'Skip-Caching': 'true',
            'Skip-Semantish': 'true'
          });
        });

        it('should merge headers', () => {
          const rawConfig: any = {
            bridge: {
              headers: { Some: 'Headers' },
              skipCache: true
            }
          };

          const config = Configuration.transform(rawConfig, new Configuration(rawConfig).handlers);

          expect(config.bridge.headers).to.eql({
            Some: 'Headers',
            'Skip-Caching': 'true'
          });
        });

        it('should not clobber timeout', () => {
          const rawConfig: any = { bridge: { timeout: 1300 } };

          const config = Configuration.transform(rawConfig, new Configuration(rawConfig).handlers);

          expect(config.bridge.timeout).to.eq(1300);
        });
      });
    });
  });
});
