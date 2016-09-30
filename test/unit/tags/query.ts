import { Url } from '../../../src/services/url';
import { DEFAULT_CONFIG, Query } from '../../../src/tags/query/gb-query';
import suite from './_suite';
import { expect } from 'chai';
import { Events, Query as QueryModel } from 'groupby-api';

suite('gb-query', Query, ({ tag, flux, sandbox }) => {
  it('should configure itself with defaults', (done) => {
    tag().configure = (defaults) => {
      expect(defaults).to.eq(DEFAULT_CONFIG);
      done();
    };

    tag().init();
  });

  it('should listen for flux events', () => {
    flux().on = (event: string, cb: Function): any => {
      expect(event).to.eq(Events.REWRITE_QUERY);
      expect(cb).to.eq(tag().rewriteQuery);
    };

    tag().init();
  });

  it.only('should listen for input event', () => {
    // tag().on = () => console.log('on');
    const mock = sandbox().mock(tag());
    mock.expects('on')
      .twice();
    // .withArgs('mount', tag().listenForInput)
    // .onSecondCall();

    tag().init();
    mock.verify();
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
    tag().opts = { autoSearch: false };
    tag().on = (event: string, cb: Function): any => {
      if (event === 'mount') cb();
    };
    tag().listenForSubmit = () => done();

    tag().init();
  });

  it('should do a search from the parsed url', () => {
    const query = 'red sneakers';
    sinon.stub(Url, 'parseUrl', () => new QueryModel(query));
    flux().search = (queryString: string): any => expect(queryString).to.eq(queryString);

    tag().init();
  });

  it('should not do a search from the parsed url when initialSearch is true', () => {
    flux().search = (): any => expect.fail();
    tag().config = { initialSearch: true, url: {} };

    tag().init();
  });

  describe('event listeners', () => {
    it('should add input listener', (done) => {
      flux().reset = () => done();
      tag().searchBox = <any>{
        addEventListener(event: string, cb: Function) {
          expect(event).to.eq('input');
          cb();
        }
      };

      tag().listenForInput();
    });
    //
    // it('should add submit listener', (done) => {
    //   flux().reset = () => done();
    //   tag().searchBox = <any>{
    //     addEventListener(event: string, cb: Function) {
    //       expect(event).to.eq('keydown');
    //       cb({ keyCode: 13 });
    //     }
    //   };
    //
    //   tag().listenForSubmit();
    // });
    //
    // it('should add enter key listener', (done) => {
    //   tag().searchBox = <any>{
    //     addEventListener(event: string, cb: Function) {
    //       expect(event).to.eq('keydown');
    //       done();
    //     }
    //   };
    //
    //   tag().onPressEnter(() => null);
    // });
  });
});
