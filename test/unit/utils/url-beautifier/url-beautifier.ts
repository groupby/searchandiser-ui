import {
  DetailUrlGenerator, DetailUrlParser,
  NavigationUrlGenerator, NavigationUrlParser,
  QueryUrlGenerator, QueryUrlParser, UrlBeautifier
} from '../../../../src/utils/url-beautifier';
import { refinement } from '../../../utils/fixtures';
import { expect } from 'chai';
import { Query } from 'groupby-api';
import * as parseUri from 'parseUri';

describe('URL beautifier', () => {
  let beautifier: UrlBeautifier;
  let sandbox: Sinon.SinonSandbox;
  let stub;

  beforeEach(() => {
    beautifier = new UrlBeautifier();
    sandbox = sinon.sandbox.create();
    stub = (...args: any[]) => (<any>sandbox.stub)(...args);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('generator', () => {

    it('should call query url generator', () => {
      const query: Query = new Query();
      const build = stub(QueryUrlGenerator.prototype, 'build');

      beautifier.buildQueryUrl(query);

      expect(build).to.have.been.calledWith(query);
    });

    it('should call navigation url generator', () => {
      const name = 'Apples';
      const build = stub(NavigationUrlGenerator.prototype, 'build');

      beautifier.buildNavigationUrl(name);

      expect(build).to.have.been.calledWith(name);
    });

    it('should call detail url generator', () => {
      const detail = {
        productTitle: 'Apples',
        productID: '12345'
      };
      const build = stub(DetailUrlGenerator.prototype, 'build');

      beautifier.buildDetailUrl(detail);

      expect(build).to.have.been.calledWith(detail);
    });
  });

  describe('parser', () => {
    it('should call query url parser', () => {
      const parse = stub(QueryUrlParser.prototype, 'parse');
      const uri = parseUri('http://example.com/apples/green/qc');

      beautifier.parse('http://example.com/query/apples/green/qc');

      expect(parse).to.have.been.calledWith({ path: uri.path, query: uri.query });
    });

    it('should call detail url parser', () => {
      const parse = stub(DetailUrlParser.prototype, 'parse');
      const uri = parseUri('http://example.com/apples/green/qc/1045');

      beautifier.parse('http://example.com/detail/apples/green/qc/1045');

      expect(parse).to.have.been.calledWith({ path: uri.path, query: uri.query });
    });

    it('should call navigation url parser', () => {
      const parse = stub(NavigationUrlParser.prototype, 'parse');
      const uri = parseUri('http://example.com/Apples');

      beautifier.parse('http://example.com/navigation/Apples');

      expect(parse).to.have.been.calledWith({ path: uri.path, query: uri.query });
    });

    it('should extract mapped and unmapped refinements with query and suffix', () => {
      const refs = [refinement('category', 'Drills'), refinement('brand', 'DeWalt'), refinement('colour', 'orange')];
      const url = 'http://example.com/query/power-drill/orange/Drills/nsc/index.html?nav=brand%3ADeWalt';
      beautifier.config.refinementMapping.push({ s: 'colour' }, { c: 'category' });
      beautifier.config.extraRefinementsParam = 'nav';
      beautifier.config.queryToken = 'n';
      beautifier.config.suffix = 'index.html';

      const request = beautifier.parse(url).build();

      expect(request.query).to.eql('power drill');
      expect(request.refinements).to.have.deep.members(refs);
    });

    describe('error state', () => {
      it('should throw an error if prefix is none of query, detail or navigation', () => {
        expect(() => beautifier.parse('http://example.com/my/nested/path/power-drill/q')).to.throw('invalid prefix');
      });
    });
  });
});
