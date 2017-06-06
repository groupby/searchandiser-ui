import { expect } from 'chai';
import { Query } from 'groupby-api';
import { UrlBeautifier, QueryUrlGenerator, QueryUrlParser, NavigationUrlGenerator, NavigationUrlParser, DetailUrlGenerator, DetailUrlParser, Detail } from '../../../../src/utils/url-beautifier';
import { refinement } from '../../../utils/fixtures';

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

      beautifier.parse('http://example.com/query/apples/green/qc');

      expect(parse).to.have.been.calledWith('/apples/green/qc');
    });

    it('should call detail url parser', () => {
      const parse = stub(DetailUrlParser.prototype, 'parse');

      beautifier.parse('http://example.com/detail/apples/green/qc/1045');

      expect(parse).to.have.been.calledWith('/apples/green/qc/1045');
    });

    it('should call navigation url parser', () => {
      const parse = stub(NavigationUrlParser.prototype, 'parse');

      beautifier.parse('http://example.com/navigation/Apples');

      expect(parse).to.have.been.calledWith('/Apples');
    });
  });
});
