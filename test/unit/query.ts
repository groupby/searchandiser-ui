import { FluxCapacitor, Events, Query as QueryModel } from 'groupby-api';
import { Query } from '../../src/tags/query/gb-query';
import * as utils from '../../src/utils';
import { expect } from 'chai';

describe('gb-query logic', () => {
  let query: Query;
  let flux: FluxCapacitor;
  let sandbox: Sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    query = Object.assign(new Query(), {
      flux: flux = new FluxCapacitor(''),
      opts: {},
      config: {},
      on: () => null
    });
  });

  afterEach(() => sandbox.restore());

  it('should have default values', () => {
    query.init();

    expect(query.parentOpts).to.eql({});
    expect(query.queryParam).to.eq('q');
    expect(query.searchUrl).to.eq('search');
    expect(query.staticSearch).to.be.false;
    expect(query.saytEnabled).to.be.true;
    expect(query.autoSearch).to.be.true;
    expect(query.queryFromUrl).to.be.ok;
    expect(query.queryFromUrl.raw.query).to.eq('');
  });

  it('should allow override from opts', () => {
    const queryParam = 'query';
    const searchUrl = 'search.html';

    query.opts = {
      queryParam, searchUrl,
      staticSearch: true,
      sayt: false,
      autoSearch: false
    };
    query.init();

    expect(query.queryParam).to.eq(queryParam);
    expect(query.searchUrl).to.eq(searchUrl);
    expect(query.staticSearch).to.be.true;
    expect(query.saytEnabled).to.be.false;
    expect(query.autoSearch).to.be.false;
  });

  it('should accept passthrough from parents', () => {
    const passthrough = { a: 'b' };

    query.opts = { passthrough };
    query.init();

    expect(query.parentOpts).to.eq(passthrough);
  });

  it('should listen for flux events', () => {
    flux.on = (event: string, cb: Function): any => {
      expect(event).to.eq(Events.REWRITE_QUERY);
      expect(cb).to.eq(query.rewriteQuery);
    };

    query.init();
  });

  it('should listen for input event', (done) => {
    let callback;
    query.on = (event: string, cb: Function): any => {
      if (event === 'before-mount') callback = cb;
    };
    query.listenForInput = () => done();

    query.init();

    callback();
  });

  it('should listen for enter keypress event', (done) => {
    let callback;
    query.opts = { autoSearch: false, staticSearch: true };
    query.on = (event: string, cb: Function): any => {
      if (event === 'before-mount') callback = cb;
    };
    query.listenForEnter = () => done();

    query.init();

    callback();
  });

  it('should listen for submit event', (done) => {
    let callback;
    query.opts = { autoSearch: false };
    query.on = (event: string, cb: Function): any => {
      if (event === 'before-mount') callback = cb;
    };
    query.listenForSubmit = () => done();

    query.init();

    callback();
  });

  describe('event listeners', () => {
    it('should add input listener', (done) => {
      flux.reset = () => done();
      query.root = <any>{
        addEventListener: (event: string, cb: Function) => {
          expect(event).to.eq('input');
          cb();
        }
      };

      query.listenForInput(() => null);
    });

    it('should add submit listener', (done) => {
      flux.reset = () => done();
      query.root = <any>{
        addEventListener: (event: string, cb: Function) => {
          expect(event).to.eq('keydown');
          cb({ keyCode: 13 });
        }
      };

      query.listenForSubmit(() => null);
    });

    it('should add enter key listener', (done) => {
      query.root = <any>{
        addEventListener: (event: string, cb: Function) => {
          expect(event).to.eq('keydown');
          done();
        }
      };

      query.listenForEnter(() => null);
    });
  });

  it('should do a search from the parsed url', () => {
    const queryString = 'red sneakers';
    sinon.stub(utils, 'parseQueryFromLocation', () => new QueryModel(queryString));
    flux.search = (queryString: string): any => expect(queryString).to.eq(queryString);

    query.init();
  });

  it('should not do a search from the parsed url when initialSearch is true', () => {
    flux.search = (): any => expect.fail();
    query.config = { initialSearch: true };

    query.init();
  });
});
