import { Url } from '../../../src/services/url';
import { LOCATION } from '../../../src/utils/common';
import { SimpleBeautifier } from '../../../src/utils/simple-beautifier';
import { UrlBeautifier } from '../../../src/utils/url-beautifier';
import { expect } from 'chai';
import { Query } from 'groupby-api';

describe('url service', () => {
  let sandbox: Sinon.SinonSandbox;

  beforeEach(() => sandbox = sinon.sandbox.create());
  afterEach(() => sandbox.restore());

  describe('init()', () => {
    it('should initialise beautifiers', () => {
      const config: any = { url: {}, initialSearch: true };
      const service = new Url(<any>{}, config, <any>{});

      service.init();

      expect(service.beautifier).to.be.an.instanceof(UrlBeautifier);
      expect(service.simple).to.be.an.instanceof(SimpleBeautifier);
    });

    it('should not do search on initialSearch = true', () => {
      const config: any = { url: {}, initialSearch: true };
      sandbox.stub(Url, 'parseUrl', () => expect.fail());
      sandbox.stub(Url, 'parseBeautifiedUrl', () => expect.fail());
      const service = new Url(<any>{}, config, <any>{});

      service.init();
    });

    describe('simple', () => {
      it('should parse query from location', (done) => {
        const origConfig: any = { url: { queryParam: 'q' } };
        const query = new Query('test');
        const parseUrl = sandbox.stub(Url, 'parseUrl', (beautifier) => {
          expect(beautifier).to.be.an.instanceof(SimpleBeautifier);
          return query;
        });
        const flux: any = {
          search: (queryString) => {
            expect(queryString).to.eq('test');
            expect(flux.query).to.eq(query);
            expect(parseUrl.called).to.be.true;
            done();
          }
        };
        const service = new Url(flux, origConfig, <any>{});

        service.init();
      });

      it('should emit tracker event', (done) => {
        const origConfig: any = { url: { queryParam: 'q' } };
        const query = new Query('test');
        const flux: any = { search: (queryString) => Promise.resolve() };
        const service = new Url(flux, origConfig, <any>{ tracker: { search: () => done() } });
        sandbox.stub(Url, 'parseUrl', () => query);

        service.init();
      });
    });

    describe('beautified', () => {
      it('should parse query from beautified location', (done) => {
        const origConfig: any = { url: { beautifier: true } };
        const query = new Query('test');
        const stub = sandbox.stub(Url, 'parseBeautifiedUrl', (beautifier) => {
          expect(beautifier).to.be.an.instanceof(UrlBeautifier);
          return query;
        });
        const flux: any = {
          search: (queryString) => {
            expect(queryString).to.eq('test');
            expect(flux.query).to.eq(query);
            expect(stub.called).to.be.true;
            done();
          }
        };
        const service = new Url(flux, origConfig, <any>{});

        service.init();
      });

      it('should emit tracker event', (done) => {
        const origConfig: any = { url: { beautifier: true } };
        const query = new Query('test');
        const flux: any = { search: (queryString) => Promise.resolve() };
        const service = new Url(flux, origConfig, <any>{ tracker: { search: () => done() } });
        sandbox.stub(Url, 'parseBeautifiedUrl', () => query);

        service.init();
      });
    });
  });

  describe('active()', () => {
    it('should return true', () => {
      const config: any = { url: { searchUrl: '/not/my/path' } };
      const pathname = sandbox.stub(LOCATION, 'pathname').returns('/my/path');
      const service = new Url(<any>{}, config, <any>{});

      expect(service.active()).to.be.true;
      expect(pathname.called).to.be.true;
    });

    it('should return false', () => {
      const searchUrl = '/my/path';
      const pathname = sandbox.stub(LOCATION, 'pathname').returns(searchUrl);
      const service = new Url(<any>{}, <any>{ url: { searchUrl } }, <any>{});

      expect(service.active()).to.be.false;
      expect(pathname.called).to.be.true;
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
        const setLocation = sandbox.stub(Url, 'setLocation');
        const urlService = new Url(mockFlux, config, <any>{});
        urlService.simple = <any>{
          build: (query) => {
            expect(query).to.be.an.instanceof(Query);
            expect(query.raw.query).to.eq(newQuery);
            expect(query.raw.refinements).to.eql(refinements);
            return newUrl;
          }
        };

        urlService.update(newQuery);

        expect(setLocation.calledWith(newUrl, { c: 'd' })).to.be.true;
      });

      it('should update location using simple beautifier with refinements', () => {
        const refinements = [{ a: 'b' }];
        const setLocation = sandbox.stub(Url, 'setLocation');
        const urlService = new Url(<any>{ query: { raw: { refinements: [] } } }, <any>{ url: {} }, <any>{});
        const build = sinon.spy(({ raw }) => expect(raw.refinements).to.eql(refinements));
        urlService.simple = <any>{ build };

        urlService.update('red shoes', refinements);

        expect(setLocation.called).to.be.true;
        expect(build.called).to.be.true;
      });
    });

    describe('beautified', () => {
      it('should build update location using beautifier', () => {
        const newQuery = 'query';
        const newUrl = 'example.com';
        const refinements = [{ a: 'b' }];
        const mockFlux: any = { query: { raw: { refinements } } };
        const config: any = { url: { beautifier: true } };
        const setLocation = sandbox.stub(Url, 'setLocation');
        const urlService = new Url(mockFlux, config, <any>{});
        urlService.beautifier = <any>{
          build: (query: Query) => {
            expect(query).to.be.an.instanceof(Query);
            expect(query.raw.query).to.eq(newQuery);
            expect(query.raw.refinements).to.eql(refinements);
            return newUrl;
          }
        };

        urlService.update(newQuery);

        expect(setLocation.calledWith(newUrl, { beautifier: true })).to.be.true;
      });

      it('should update location using beautifier with refinements', () => {
        const refinements = [{ a: 'b' }];
        const config: any = { url: { beautifier: true } };
        const setLocation = sandbox.stub(Url, 'setLocation');
        const urlService = new Url(<any>{ query: { raw: { refinements: [] } } }, config, <any>{});
        const build = sinon.spy(({ raw }) => expect(raw.refinements).to.eql(refinements));
        urlService.beautifier = <any>{ build };

        urlService.update('red shoes', refinements);

        expect(setLocation.called).to.be.true;
        expect(build.called).to.be.true;
      });
    });
  });

  describe('parseUrl()', () => {
    it('should call parse with the current url', () => {
      const parse = sinon.spy();
      const beautifier: any = { parse };

      Url.parseUrl(beautifier);

      expect(parse.calledWith(window.location.href)).to.be.true;
    });
  });

  describe('parseBeautifiedUrl()', () => {
    it('should call parse with the current url', () => {
      const parse = sinon.spy();
      const beautifier: any = { parse };

      Url.parseBeautifiedUrl(beautifier);

      expect(parse.calledWith(window.location.href)).to.be.true;
    });
  });

  describe('setLocation()', () => {
    const SEARCH_URL = '/my/path';
    let pathname: Sinon.SinonStub;

    beforeEach(() => pathname = sandbox.stub(LOCATION, 'pathname').returns(SEARCH_URL));
    afterEach(() => expect(pathname.called).to.be.true);

    it('should update search', () => {
      const newUrl = 'example.com/search?q=hats';
      const setSearch = sandbox.stub(LOCATION, 'setSearch');

      Url.setLocation(newUrl, { searchUrl: SEARCH_URL });

      expect(setSearch.calledWith('?q=hats')).to.be.true;
    });

    it('should replace url', () => {
      const newUrl = 'example.com/things?q=hats';
      const replace = sandbox.stub(LOCATION, 'replace');

      Url.setLocation(newUrl, { searchUrl: '/search' });

      expect(replace.calledWith(newUrl)).to.be.true;
    });
  });
});
