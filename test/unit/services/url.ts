import { REFINE_EVENT } from '../../../src/services/search';
import { Url } from '../../../src/services/url';
import { LOCATION } from '../../../src/utils/common';
import { SimpleBeautifier } from '../../../src/utils/simple-beautifier';
import { UrlBeautifier } from '../../../src/utils/url-beautifier';
import { refinement } from '../../utils/fixtures';
import suite from './_suite';
import { Query } from 'groupby-api';

suite('url', ({ expect, spy, stub }) => {

  describe('constructor()', () => {
    it('should set urlConfig from config.url', () => {
      const urlConfig = {};

      const service = new Url(<any>{}, <any>{ url: urlConfig }, <any>{});

      expect(service.urlConfig).to.eq(urlConfig);
    });

    it('should default to empty urlConfig', () => {
      const service = new Url(<any>{}, <any>{}, <any>{});

      expect(service.urlConfig).to.eql({});
    });

    it('should set beautify to false', () => {
      const service = new Url(<any>{}, <any>{}, <any>{});

      expect(service.beautify).to.be.false;
    });

    it('should set beautify to true', () => {
      const service = new Url(<any>{}, <any>{ url: { beautifier: true } }, <any>{});

      expect(service.beautify).to.be.true;
    });
  });

  describe('init()', () => {
    it('should initialise beautifiers', () => {
      const config: any = { url: {}, initialSearch: true };
      const service = new Url(<any>{}, config, <any>{ search: {} });

      service.init();

      expect(service.beautifier).to.be.an.instanceof(UrlBeautifier);
      expect(service.simple).to.be.an.instanceof(SimpleBeautifier);
    });

    it('should not do search on initialSearch = true', () => {
      const config: any = { url: {}, initialSearch: true };
      stub(Url, 'parseUrl', () => expect.fail());
      stub(Url, 'parseBeautifiedUrl', () => expect.fail());
      const service = new Url(<any>{}, config, <any>{ search: {} });

      service.init();
    });

    describe('simple', () => {
      it('should parse query from location', () => {
        const emit = spy();
        const query = 'test';
        const parseUrl = stub(Url, 'parseUrl').returns(new Query(query));
        const service = new Url(<any>{ emit }, <any>{}, <any>{ search: {} });

        service.init();

        expect(parseUrl).to.be.calledWith(sinon.match.instanceOf(SimpleBeautifier));
        expect(emit).to.be.calledWith(REFINE_EVENT, { query, refinements: [] });
      });

      it('should search with refinements', () => {
        const emit = spy();
        const service = new Url(<any>{ emit }, <any>{}, <any>{ search: {} });
        stub(Url, 'parseUrl')
          .returns(new Query().withRefinements('brand', { type: 'Value', value: 'Nike' }));

        service.init();

        expect(emit).to.be.calledWith(REFINE_EVENT, {
          query: '',
          refinements: [refinement('brand', 'Nike')]
        });
      });

      it('should not search if no recall fields specified', () => {
        const service = new Url(<any>{ emit: () => expect.fail() }, <any>{}, <any>{ search: {} });
        stub(Url, 'parseUrl').returns(new Query());

        service.init();
      });
    });

    describe('beautified', () => {
      const config: any = { url: { beautifier: true } };

      it('should parse query from beautified location', () => {
        const emit = spy();
        const query = 'test';
        const parseBeautifiedUrl = stub(Url, 'parseBeautifiedUrl').returns(new Query(query));
        const service = new Url(<any>{ emit }, config, <any>{ search: {} });

        service.init();

        expect(parseBeautifiedUrl).to.be.calledWith(sinon.match.instanceOf(UrlBeautifier));
        expect(emit).to.be.calledWith(REFINE_EVENT, { query, refinements: [] });
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
    it('should update search', () => {
      const newUrl = 'example.com/search?q=hats';
      const setSearch = stub(LOCATION, 'setSearch');

      Url.setLocation(newUrl, {});

      expect(setSearch).to.be.calledWith('?q=hats');
    });

    it('should replace url', () => {
      const newUrl = 'example.com/things?q=hats';
      const replace = stub(LOCATION, 'replace');

      Url.setLocation(newUrl, { staticSearch: true });

      expect(replace).to.be.calledWith(newUrl);
    });
  });
});
