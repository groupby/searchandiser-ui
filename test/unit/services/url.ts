import { Url } from '../../../src/services/url';
import { SimpleBeautifier } from '../../../src/simple-beautifier';
import { UrlBeautifier } from '../../../src/url-beautifier';
import { LOCATION } from '../../../src/utils';
import { expect } from 'chai';
import { Query } from 'groupby-api';

describe('url service', () => {
  let sandbox: Sinon.SinonSandbox;

  beforeEach(() => sandbox = sinon.sandbox.create());
  afterEach(() => sandbox.restore());

  describe('init()', () => {
    it('should initialise beautifiers', () => {
      const config: any = { url: {}, initialSearch: true };

      const urlService = new Url(<any>{}, config);
      urlService.init();

      expect(urlService.beautifier).to.be.an.instanceof(UrlBeautifier);
      expect(urlService.simple).to.be.an.instanceof(SimpleBeautifier);
    });

    it('should not do search on initialSearch = true', () => {
      const config: any = { url: {}, initialSearch: true };
      const simpleSpy = sandbox.spy(Url.parseUrl);
      const beautifulSpy = sandbox.spy(Url.parseBeautifiedUrl);

      new Url(<any>{}, config).init();
      expect(simpleSpy.called).to.not.be.true;
      expect(beautifulSpy.called).to.not.be.true;
    });

    describe('simple', () => {
      it('should parse query from location', () => {
        const origConfig: any = { url: { queryParam: 'q' } };
        const query = new Query('test');
        sandbox.stub(Url, 'parseUrl', (beautifier) => {
          expect(beautifier).to.be.an.instanceof(SimpleBeautifier);
          return query;
        });
        const flux: any = { search: (queryString) => expect(queryString).to.eq('test') };

        new Url(flux, origConfig).init();
        expect(flux.query).to.eq(query);
      });
    });

    describe('beautified', () => {
      it('should parse query from beautified location', () => {
        const origConfig: any = { url: { beautifier: true } };
        const query = new Query('test');
        sandbox.stub(Url, 'parseBeautifiedUrl', (beautifier) => {
          expect(beautifier).to.be.an.instanceof(UrlBeautifier);
          return query;
        });
        const flux: any = { search: (queryString) => expect(queryString).to.eq('test') };

        new Url(flux, origConfig).init();
        expect(flux.query).to.eq(query);
      });
    });
  });

  describe('active()', () => {
    it('should return true', () => {
      const config: any = { url: { searchUrl: '/not/my/path' } };
      sandbox.stub(LOCATION, 'pathname', () => '/my/path');

      expect(new Url(<any>{}, config).active()).to.be.true;
    });

    it('should return false', () => {
      const searchUrl = '/my/path';
      sandbox.stub(LOCATION, 'pathname', () => searchUrl);

      expect(new Url(<any>{}, <any>{ url: { searchUrl } }).active()).to.be.false;
    });
  });

  describe('update()', () => {
    describe('simple', () => {
      it('should build query using simple beautifier', () => {
        const newQuery = 'red shoes';
        const newUrl = 'example.com';
        const refinements = [{ a: 'b' }];
        const mockFlux: any = { query: { raw: { refinements } } };
        const config: any = { url: { c: 'd' } };
        sandbox.stub(Url, 'setLocation', (url, urlConfig) => {
          expect(url).to.eq(newUrl);
          expect(urlConfig).to.eql({ c: 'd' });
        });

        const urlService = new Url(mockFlux, config);
        urlService.simple = <any>{
          build: (query) => {
            expect(query).to.be.an.instanceof(Query);
            expect(query.raw.query).to.eq(newQuery);
            expect(query.raw.refinements).to.eql(refinements);
            return newUrl;
          }
        };

        urlService.update(newQuery);
      });

      it('should update location using simple beautifier with refinements', () => {
        const refinements = [{ a: 'b' }];
        sandbox.stub(Url, 'setLocation');

        const urlService = new Url(<any>{ query: { raw: { refinements: [] } } }, <any>{ url: {} });
        urlService.simple = <any>{
          build: ({ raw }) => expect(raw.refinements).to.eql(refinements)
        };

        urlService.update('red shoes', refinements);
      });
    });

    describe('beautified', () => {
      it('should build update location using beautifier', () => {
        const newQuery = 'query';
        const newUrl = 'example.com';
        const refinements = [{ a: 'b' }];
        const mockFlux: any = { query: { raw: { refinements } } };
        const config: any = { url: { beautifier: true } };
        sandbox.stub(Url, 'setLocation', (url, urlConfig) => {
          expect(url).to.eq(newUrl);
          expect(urlConfig).to.eql({ beautifier: true });
        });

        const urlService = new Url(mockFlux, config);
        urlService.beautifier = <any>{
          build: (query: Query) => {
            expect(query).to.be.an.instanceof(Query);
            expect(query.raw.query).to.eq(newQuery);
            expect(query.raw.refinements).to.eql(refinements);
            return newUrl;
          }
        };

        urlService.update(newQuery);
      });

      it('should update location using beautifier with refinements', () => {
        const refinements = [{ a: 'b' }];
        const config: any = { url: { beautifier: true } };
        sandbox.stub(Url, 'setLocation');

        const urlService = new Url(<any>{ query: { raw: { refinements: [] } } }, config);
        urlService.beautifier = <any>{
          build: ({ raw }) => expect(raw.refinements).to.eql(refinements)
        };

        urlService.update('red shoes', refinements);
      });
    });
  });

  describe('parseUrl()', () => {
    it('should call parse with the current url', () => {
      const beautifier: any = { parse: (url) => expect(url).to.eql(window.location.href) };

      Url.parseUrl(beautifier);
    });
  });

  describe('parseBeautifiedUrl()', () => {
    it('should call parse with the current url', () => {
      const beautifier: any = { parse: (url) => expect(url).to.eql(window.location.href) };

      Url.parseBeautifiedUrl(beautifier);
    });
  });

  describe('setLocation()', () => {
    const searchUrl = '/my/path';

    beforeEach(() => sandbox.stub(LOCATION, 'pathname', () => searchUrl));

    it('should update search', () => {
      const newUrl = 'example.com/search?q=hats';
      sandbox.stub(LOCATION, 'setSearch', (query) => expect(query).to.eq('?q=hats'));

      Url.setLocation(newUrl, { searchUrl });
    });

    it('should replace url', () => {
      const newUrl = 'example.com/things?q=hats';
      sandbox.stub(LOCATION, 'replace', (url) => expect(url).to.eq(newUrl));

      Url.setLocation(newUrl, { searchUrl: '/search' });
    });
  });
});
