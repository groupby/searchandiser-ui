import { UrlParser } from '../../../src/services/url-parser';
import { Query } from '../../../src/tags/query/gb-query';
import suite from './_suite';
import { expect } from 'chai';
import { Events, Query as QueryModel } from 'groupby-api';

const config = {
  url: {
    queryParam: 'q',
    searchUrl: 'search'
  }
};

suite('gb-query', Query, { config }, ({ tag, flux }) => {
  it('should have default values', () => {
    tag().init();

    expect(tag().parentOpts).to.eql({});
    expect(tag().queryParam).to.eq('q');
    expect(tag().searchUrl).to.eq('search');
    expect(tag().staticSearch).to.be.false;
    expect(tag().saytEnabled).to.be.true;
    expect(tag().autoSearch).to.be.true;
  });

  it('should allow override from opts', () => {
    tag().opts = {
      staticSearch: true,
      sayt: false,
      autoSearch: false
    };
    tag().init();

    expect(tag().staticSearch).to.be.true;
    expect(tag().saytEnabled).to.be.false;
    expect(tag().autoSearch).to.be.false;
  });

  it('should accept passthrough from parents', () => {
    const passthrough = { a: 'b' };

    tag().opts = { passthrough };
    tag().init();

    expect(tag().parentOpts).to.eq(passthrough);
  });

  it('should listen for flux events', () => {
    flux().on = (event: string, cb: Function): any => {
      expect(event).to.eq(Events.REWRITE_QUERY);
      expect(cb).to.eq(tag().rewriteQuery);
    };

    tag().init();
  });

  it('should listen for input event', (done) => {
    let callback;
    tag().on = (event: string, cb: Function): any => {
      if (event === 'mount') callback = cb;
    };
    tag().listenForInput = () => done();

    tag().init();

    callback();
  });

  it('should listen for enter keypress event', () => {
    let count = 0;
    tag().opts = { autoSearch: false, staticSearch: true };
    tag().on = (event: string, cb: Function): any => {
      if (event === 'mount' && ++count === 2) expect(cb).to.eq(tag().listenForStaticSearch);
    };

    tag().init();
  });

  it('should listen for submit event', (done) => {
    let callback;
    tag().opts = { autoSearch: false };
    tag().on = (event: string, cb: Function): any => {
      if (event === 'mount') callback = cb;
    };
    tag().listenForSubmit = () => done();

    tag().init();

    callback();
  });

  it('should do a search from the parsed url', () => {
    const query = 'red sneakers';
    sinon.stub(UrlParser, 'parseQueryFromLocation', () => new QueryModel(query));
    flux().search = (queryString: string): any => expect(queryString).to.eq(queryString);

    tag().init();
  });

  it('should not do a search from the parsed url when initialSearch is true', () => {
    flux().search = (): any => expect.fail();
    tag().config = { initialSearch: true, url: {} };

    tag().init();
  });

  // describe('event listeners', () => {
  //   it('should add input listener', (done) => {
  //     flux().reset = () => done();
  //     tag().searchBox = <any>{
  //       addEventListener(event: string, cb: Function) {
  //         expect(event).to.eq('input');
  //         cb();
  //       }
  //     };
  //
  //     tag().listenForInput();
  //   });
  //
  //   it('should add submit listener', (done) => {
  //     flux().reset = () => done();
  //     tag().searchBox = <any>{
  //       addEventListener(event: string, cb: Function) {
  //         expect(event).to.eq('keydown');
  //         cb({ keyCode: 13 });
  //       }
  //     };
  //
  //     tag().listenForSubmit();
  //   });
  //
  //   it('should add enter key listener', (done) => {
  //     tag().searchBox = <any>{
  //       addEventListener(event: string, cb: Function) {
  //         expect(event).to.eq('keydown');
  //         done();
  //       }
  //     };
  //
  //     tag().onPressEnter(() => null);
  //   });
  // });
});
