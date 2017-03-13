import { Url } from '../../../src/services/url';
import { LOCATION } from '../../../src/utils/common';
import { SimpleBeautifier } from '../../../src/utils/simple-beautifier';
import { UrlBeautifier } from '../../../src/utils/url-beautifier';
import suite from './_suite';
import { expect } from 'chai';
import { Query } from 'groupby-api';

suite('url', ({ spy, stub }) => {

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
      stub(Url, 'parseUrl', () => expect.fail());
      stub(Url, 'parseBeautifiedUrl', () => expect.fail());
      const service = new Url(<any>{}, config, <any>{});

      service.init();
    });

    describe('simple', () => {
      it('should parse query from location', (done) => {
        const origConfig: any = { url: { queryParam: 'q' } };
        const query = new Query('test');
        const parseUrl = stub(Url, 'parseUrl').returns(query);
        const flux: any = {
          search: (queryString) => {
            expect(queryString).to.eq('test');
            expect(flux.query).to.eq(query);
            expect(parseUrl).to.be.calledWith(sinon.match.instanceOf(SimpleBeautifier));
            done();
          }
        };
        const service = new Url(flux, origConfig, <any>{});

        service.init();
      });

      it('should search with refinements', (done) => {
        const origConfig: any = { url: { queryParam: 'q' } };
        const query = new Query().withRefinements('brand', { type: 'Value', value: 'Nike' });
        const flux: any = { search: (queryString) => done() };
        const service = new Url(flux, origConfig, <any>{});
        stub(Url, 'parseUrl').returns(query);

        service.init();
      });

      it('should not search if no recall fields specified', () => {
        const origConfig: any = { url: { queryParam: 'q' } };
        const query = new Query();
        const flux: any = { search: (queryString) => expect.fail() };
        const service = new Url(flux, origConfig, <any>{});
        stub(Url, 'parseUrl').returns(query);

        service.init();
      });

      it('should emit tracker event', (done) => {
        const origConfig: any = { url: { queryParam: 'q' } };
        const query = new Query('test');
        const flux: any = { search: (queryString) => Promise.resolve() };
        const service = new Url(flux, origConfig, <any>{ tracker: { search: () => done() } });
        stub(Url, 'parseUrl', () => query);

        service.init();
      });
    });

    describe('beautified', () => {
      it('should parse query from beautified location', (done) => {
        const origConfig: any = { url: { beautifier: true } };
        const query = new Query('test');
        const parseBeautifiedUrl = stub(Url, 'parseBeautifiedUrl').returns(query);
        const flux: any = {
          search: (queryString) => {
            expect(queryString).to.eq('test');
            expect(flux.query).to.eq(query);
            expect(parseBeautifiedUrl).to.be.calledWith(sinon.match.instanceOf(UrlBeautifier));
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
        stub(Url, 'parseBeautifiedUrl', () => query);

        service.init();
      });
    });
  });

  describe('active()', () => {
    it('should return true', () => {
      const config: any = { url: { searchUrl: '/not/my/path' } };
      const pathname = stub(LOCATION, 'pathname').returns('/my/path');
      const service = new Url(<any>{}, config, <any>{});

      expect(service.isActive()).to.be.true;
      expect(pathname).to.be.called;
    });

    it('should return false', () => {
      const searchUrl = '/my/path';
      const pathname = stub(LOCATION, 'pathname').returns(searchUrl);
      const service = new Url(<any>{}, <any>{ url: { searchUrl } }, <any>{});

      expect(service.isActive()).to.be.false;
      expect(pathname).to.be.called;
    });
  });

  describe('update()', () => {
    describe('simple', () => {
      it('should update location using simple beautifier', () => {
        const query = new Query('red shoes').withSelectedRefinements(<any>{ a: 'b' });
        const newUrl = 'example.com';
        const setLocation = stub(Url, 'setLocation');
        const urlService = new Url(<any>{}, <any>{ url: {} }, <any>{});
        const build = spy(() => newUrl);
        urlService.simple = <any>{ build };

        urlService.update(query);

        expect(setLocation).to.be.calledWith(newUrl);
        expect(build).to.be.calledWith(query);
      });
    });

    describe('beautified', () => {
      it('should update location using beautifier with refinements', () => {
        const query = new Query('red shoes').withSelectedRefinements(<any>{ a: 'b' });
        const newUrl = 'example.com';
        const config: any = { url: { beautifier: true } };
        const setLocation = stub(Url, 'setLocation');
        const urlService = new Url(<any>{}, config, <any>{});
        const build = spy(() => newUrl);
        urlService.beautifier = <any>{ build };

        urlService.update(query);

        expect(setLocation).to.be.calledWith(newUrl);
        expect(build).to.be.calledWith(query);
      });
    });
  });

  describe('parseUrl()', () => {
    it('should call parse with the current url', () => {
      const parse = spy();
      const beautifier: any = { parse };

      Url.parseUrl(beautifier);

      expect(parse).to.be.calledWith(window.location.href);
    });
  });

  describe('parseBeautifiedUrl()', () => {
    it('should call parse with the current url', () => {
      const parse = spy();
      const beautifier: any = { parse };

      Url.parseBeautifiedUrl(beautifier);

      expect(parse).to.be.calledWith(window.location.href);
    });
  });

  describe('setLocation()', () => {
    const SEARCH_URL = '/my/path';
    let pathname: Sinon.SinonStub;

    beforeEach(() => pathname = stub(LOCATION, 'pathname').returns(SEARCH_URL));
    afterEach(() => expect(pathname).to.be.called);

    it('should update search', () => {
      const newUrl = 'example.com/search?q=hats';
      const setSearch = stub(LOCATION, 'setSearch');

      Url.setLocation(newUrl, { searchUrl: SEARCH_URL });

      expect(setSearch).to.be.calledWith('?q=hats');
    });

    it('should replace url', () => {
      const newUrl = 'example.com/things?q=hats';
      const replace = stub(LOCATION, 'replace');

      Url.setLocation(newUrl, { searchUrl: '/search' });

      expect(replace).to.be.calledWith(newUrl);
    });
  });
});
