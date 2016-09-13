import { Url } from '../../../src/services/url';
import { Query } from '../../../src/tags/query/gb-query';
import * as utils from '../../../src/utils/common';
import suite from './_suite';
import { expect } from 'chai';
import { Events, Query as QueryModel } from 'groupby-api';

suite('gb-query', Query, ({ tag, flux, sandbox }) => {
  it('should have default values', () => {
    tag().init();

    expect(tag().parentOpts).to.eql({});
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
    it('should add click listener on mobile devices', (done) => {
      sandbox().stub(utils, 'isMobile', () => true);
      tag().searchBox = document.createElement('input');
      tag().init();

      tag().searchBox = <any>{
        addEventListener(event: string, cb: Function) {
          expect(event).to.eq('click');
          cb();
        }
      };

      tag().scrollToTop = done();

      tag().listenForClick();
    });

    it('should not add click listener on non-mobile devices', () => {
      sandbox().stub(utils, 'isMobile', () => false);
      const spy = sinon.spy(tag(), 'scrollToTop');
      tag().searchBox = document.createElement('input');
      tag().init();

      tag().searchBox = <any>{
        addEventListener(event: string, cb: Function) {
          expect(event).to.eq('click');
          cb();
        }
      };

      tag().listenForClick();
      expect(spy.callCount).to.eq(0);
    });

    it('should add input listener', (done) => {
      tag().searchBox = document.createElement('input');
      tag().init();

      flux().reset = (): any => done();
      tag().searchBox = <any>{
        addEventListener(event: string, cb: Function) {
          expect(event).to.eq('input');
          cb();
        }
      };

      tag().listenForInput();
    });

    it('should submit on enter keypress', () => {
      tag().init();
      const spy = sandbox().spy(tag(), 'onSubmit');
      const event = Object.assign(new Event('keydown'), { keyCode: 13 });

      tag().keydownListener(event);
      expect(spy.callCount).to.eq(1);
    });
  });
});
