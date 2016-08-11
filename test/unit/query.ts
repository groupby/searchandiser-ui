import { FluxCapacitor, Events, Query as QueryModel } from 'groupby-api';
import { fluxTag } from '../utils/tags';
import { Query } from '../../src/tags/query/gb-query';
import * as utils from '../../src/utils';
import { expect } from 'chai';

describe('gb-query logic', () => {
  let tag: Query;
  let flux: FluxCapacitor;
  let sandbox: Sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    ({ tag, flux } = fluxTag(new Query()));
  });

  afterEach(() => sandbox.restore());

  it('should have default values', () => {
    tag.init();

    expect(tag.parentOpts).to.eql({});
    expect(tag.queryParam).to.eq('q');
    expect(tag.searchUrl).to.eq('search');
    expect(tag.staticSearch).to.be.false;
    expect(tag.saytEnabled).to.be.true;
    expect(tag.autoSearch).to.be.true;
    expect(tag.queryFromUrl).to.be.ok;
    expect(tag.queryFromUrl.raw.query).to.eq('');
  });

  it('should allow override from opts', () => {
    const queryParam = 'query';
    const searchUrl = 'search.html';

    tag.opts = {
      queryParam, searchUrl,
      staticSearch: true,
      sayt: false,
      autoSearch: false
    };
    tag.init();

    expect(tag.queryParam).to.eq(queryParam);
    expect(tag.searchUrl).to.eq(searchUrl);
    expect(tag.staticSearch).to.be.true;
    expect(tag.saytEnabled).to.be.false;
    expect(tag.autoSearch).to.be.false;
  });

  it('should accept passthrough from parents', () => {
    const passthrough = { a: 'b' };

    tag.opts = { passthrough };
    tag.init();

    expect(tag.parentOpts).to.eq(passthrough);
  });

  it('should listen for flux events', () => {
    flux.on = (event: string, cb: Function): any => {
      expect(event).to.eq(Events.REWRITE_QUERY);
      expect(cb).to.eq(tag.rewriteQuery);
    };

    tag.init();
  });

  it('should listen for input event', (done) => {
    let callback;
    tag.on = (event: string, cb: Function): any => {
      if (event === 'before-mount') callback = cb;
    };
    tag.listenForInput = () => done();

    tag.init();

    callback();
  });

  it('should listen for enter keypress event', (done) => {
    let callback;
    tag.opts = { autoSearch: false, staticSearch: true };
    tag.on = (event: string, cb: Function): any => {
      if (event === 'before-mount') callback = cb;
    };
    tag.listenForEnter = () => done();

    tag.init();

    callback();
  });

  it('should listen for submit event', (done) => {
    let callback;
    tag.opts = { autoSearch: false };
    tag.on = (event: string, cb: Function): any => {
      if (event === 'before-mount') callback = cb;
    };
    tag.listenForSubmit = () => done();

    tag.init();

    callback();
  });

  describe('event listeners', () => {
    it('should add input listener', (done) => {
      flux.reset = () => done();
      tag.root = <any>{
        addEventListener: (event: string, cb: Function) => {
          expect(event).to.eq('input');
          cb();
        }
      };

      tag.listenForInput(() => null);
    });

    it('should add submit listener', (done) => {
      flux.reset = () => done();
      tag.root = <any>{
        addEventListener: (event: string, cb: Function) => {
          expect(event).to.eq('keydown');
          cb({ keyCode: 13 });
        }
      };

      tag.listenForSubmit(() => null);
    });

    it('should add enter key listener', (done) => {
      tag.root = <any>{
        addEventListener: (event: string, cb: Function) => {
          expect(event).to.eq('keydown');
          done();
        }
      };

      tag.listenForEnter(() => null);
    });
  });

  it('should do a search from the parsed url', () => {
    const query = 'red sneakers';
    sinon.stub(utils, 'parseQueryFromLocation', () => new QueryModel(query));
    flux.search = (queryString: string): any => expect(queryString).to.eq(queryString);

    tag.init();
  });

  it('should not do a search from the parsed url when initialSearch is true', () => {
    flux.search = (): any => expect.fail();
    tag.config = { initialSearch: true };

    tag.init();
  });
});