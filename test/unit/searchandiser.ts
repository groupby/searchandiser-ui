import { FluxCapacitor } from 'groupby-api';
import { Searchandiser, transformConfig, initSearchandiser } from '../../src/searchandiser';
import * as Tags from '../../src/tags/tag';
import * as handlers from '../../src/handlers';
import { expect } from 'chai';
import riot = require('riot');
import '../../src/tags/query/gb-query.tag';

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

  describe('attach logic', () => {
    it('should mount tag with full name', () => {
      const tagName = 'gb-my-tag';
      sandbox.stub(riot, 'mount', (tag, opts) => {
        expect(tag).to.eq(tagName);
        expect(opts).to.eql({});
      });

      const tags = searchandiser.attach(tagName);
      expect(tags).to.be.null;
    });

    it('should mount tag with simple name', () => {
      sandbox.stub(riot, 'mount', (tag) => expect(tag).to.eq('gb-my-tag'));

      searchandiser.attach('my-tag');
    });

    it('should mount tag with opts', () => {
      const tagName = 'gb-my-tag';
      const options = { a: 'b', c: 'd' };
      sandbox.stub(riot, 'mount', (tag, opts) => expect(opts).to.eq(options));

      searchandiser.attach(tagName, options);
    });

    it('should mount with CSS selector', () => {
      const tagName = 'gb-my-tag';
      const css = '.gb-my.tag';
      sandbox.stub(riot, 'mount', (cssSelector, tag, opts) => {
        expect(cssSelector).to.eq(css);
        expect(tag).to.eq(tagName);
      });

      searchandiser.attach(tagName, css);
    });

    it('should pass options with CSS selector', () => {
      const options = { a: 'b', c: 'd' };
      sandbox.stub(riot, 'mount', (tag, cssSelector, opts) => expect(opts).to.eql(options));

      searchandiser.attach('gb-my-tag', '.gb-my.tag', options);
    });

    it('should return a single tag', () => {
      const myTag = { a: 'b', c: 'd' };
      sandbox.stub(riot, 'mount')
        .returns([myTag]);

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

  describe('search behaviour', () => {
    it('should perform a blank search', (done) => {
      flux.emit = (event, data) => {
        expect(event).to.eq('page_changed');
        expect(data).to.eql({ pageIndex: 0, finalPage: 0 });
        done();
      };
      flux.search = (query) => {
        expect(query).to.be.undefined;
        return { then: (cb) => cb() };
      };

      searchandiser.search();
    });

    it('should perform a search with query', () => {
      const someQuery = 'some query';
      flux.search = (query) => Promise.resolve(expect(query).to.eq(someQuery));

      searchandiser.search(someQuery);
    });
  });

  describe('extract configuration', () => {
    it('should not modify the configuration', () => {
      const config = transformConfig(<any>{});
      expect(config).to.eql({});
    });

    it('should set the pageSize', () => {
      const config = transformConfig(<any>{
        pageSizes: [5, 10, 25, 50, 100]
      });
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
      it('should remove the bridge configuration', () => {
        const config = transformConfig(<any>{ bridge: {} });
        expect(config.bridge).to.not.be.ok;
      });

      it('should accept headers', () => {
        const headers = {
          These: 'Are',
          My: 'Headers'
        };

        const config = transformConfig(<any>{ bridge: { headers } });
        expect(config.headers).to.eq(headers);
      });

      it('should set configured headers', () => {
        const config = transformConfig(<any>{
          bridge: {
            skipCache: true,
            skipSemantish: true
          }
        });
        expect(config.headers).to.eql({
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
        expect(config.headers).to.eql({
          Some: 'Headers',
          'Skip-Caching': true
        });
      });
    });
  });

  it('should generate a configuration function', () => {
    const fluxMixin = { a: 'b', c: 'd' };
    sandbox.stub(Tags, 'MixinFlux', () => fluxMixin)
    sandbox.stub(riot, 'mixin', (mixin) => expect(mixin).to.eq(fluxMixin));
    sandbox.stub(handlers, 'attachHandlers', (flux) => expect(flux).to.be.an.instanceof(FluxCapacitor));

    const configure = initSearchandiser();
    expect(configure).to.be.a('function');

    configure();

    expect(configure['flux']).to.be.an.instanceof(FluxCapacitor);
    expect(configure['config']).to.eql({ initialSearch: true });
  });
});
