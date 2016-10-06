import { Url } from '../../../src/services/url';
import { DEFAULT_CONFIG, Query } from '../../../src/tags/query/gb-query';
import suite from './_suite';
import { expect } from 'chai';
import { Events, Query as QueryModel } from 'groupby-api';

suite('gb-query', Query, ({ tag, flux, sandbox }) => {

  describe('init()', () => {
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

    it('should listen for input event', () => {
      const spy = tag().on = sandbox().spy();

      tag().init();
      expect(spy.callCount).to.eq(2);
      expect(spy.secondCall.args).to.eql([
        'mount',
        tag().listenForInput
      ]);
    });

    it('should listen for enter keypress event', () => {
      tag().configure = () => tag()._config = { autoSearch: false, staticSearch: true };
      tag().on = () => tag().on = (event: string, cb: Function): any => {
        if (event === 'mount') expect(cb).to.eq(tag().listenForStaticSearch);
      };

      tag().init();
    });

    it('should listen for submit event', () => {
      tag().configure = () => tag()._config = { autoSearch: false };
      tag().on = () => tag().on = (event: string, cb: Function): any => {
        if (event === 'mount') expect(cb).to.eq(tag().listenForSubmit);
      };

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
