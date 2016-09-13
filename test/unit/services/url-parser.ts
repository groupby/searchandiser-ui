import { UrlParser } from '../../../src/services/url-parser';
import { expect } from 'chai';
import { Query } from 'groupby-api';

describe('url-parser service', () => {
  let sandbox: Sinon.SinonSandbox;
  beforeEach(() => sandbox = sinon.sandbox.create());
  afterEach(() => sandbox.restore());

  it('should parse query from location', () => {
    const query = new Query('test');
    sandbox.stub(UrlParser, 'parseQueryFromLocation', (queryParam, config) => {
      expect(queryParam).to.eq('q');
      expect(config).to.eql({});
      return query;
    });
    const flux = <any>{
      search: (queryString) => expect(queryString).to.eq('test')
    };

    new UrlParser(flux, <any>{}).init();
    expect(flux.query).to.eq(query);
  });

  it('should allow default overrides', (done) => {
    const config = { url: { queryParam: 'query' } };
    sandbox.stub(UrlParser, 'parseQueryFromLocation', (queryParam) => {
      expect(queryParam).to.eq('query');
      done();
    });

    new UrlParser(<any>{}, <any>config).init();
  });

  it('should not do search on initialSearch = true', () => {
    const config = { initialSearch: true };
    const spy = sandbox.spy(UrlParser.parseQueryFromLocation);

    new UrlParser(<any>{}, <any>config).init();
    expect(spy.called).to.not.be.true;
  });
});
