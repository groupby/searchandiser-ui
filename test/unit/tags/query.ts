import { DEFAULT_CONFIG, Query } from '../../../src/tags/query/gb-query';
import { AUTOCOMPLETE_HIDE_EVENT } from '../../../src/tags/sayt/autocomplete';
import * as utils from '../../../src/utils/common';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-query', Query, ({
  tag, flux, sandbox,
  expectSubscriptions,
  itShouldConfigure
}) => {

  describe('init()', () => {
    itShouldConfigure(DEFAULT_CONFIG);

    it('should have default values', () => {
      tag().init();

      expect(tag().enterKeyHandlers).to.eql([]);
    });

    it('should attachListeners on mount', () => {
      expectSubscriptions(() => tag().init(), {
        mount: tag().attachListeners
      }, tag());
    });

    it('should listen for flux events', () => {
      expectSubscriptions(() => tag().init(), {
        [Events.REWRITE_QUERY]: tag().rewriteQuery
      });
    });
  });

  describe('attachListeners()', () => {
    beforeEach(() => tag().findSearchBox = (): any => ({
      addEventListener: () => null
    }));

    it('should find the search box', () => {
      const searchBox = {
        addEventListener: (event, cb) => {
          expect(event).to.eq('keydown');
          expect(cb).to.eq(tag().keydownListener);
        }
      };
      tag().listenForSubmit = () => null;
      tag().findSearchBox = () => searchBox;

      tag().attachListeners();

      expect(tag().searchBox).to.eq(searchBox);
    });

    it('should attach sayt listeners', (done) => {
      tag()._config = { sayt: true };
      tag().tags = <any>{
        'gb-sayt': {
          listenForInput: (queryTag) => {
            expect(queryTag).to.eq(tag());
            done();
          }
        }
      };
      tag().findSearchBox = () => ({ addEventListener: () => null });

      tag().attachListeners();
    });

    it('should listen for input event', () => {
      const spy = tag().listenForInput = sandbox().spy();
      tag()._config = { autoSearch: true };

      tag().attachListeners();

      expect(spy.called).to.be.true;
    });

    it('should listen for enter keypress event', () => {
      const spy = tag().listenForStaticSearch = sandbox().spy();
      tag()._config = { autoSearch: false, staticSearch: true };

      tag().attachListeners();

      expect(spy.called).to.be.true;
    });

    it('should listen for submit event', () => {
      const spy = tag().listenForSubmit = sandbox().spy();
      tag()._config = { autoSearch: false, staticSearch: false };

      tag().attachListeners();

      expect(spy.called).to.be.true;
    });
  });

  describe('rewriteQuery()', () => {
    it('should set the searchBox value', () => {
      const newQuery = 'sweater';
      tag().searchBox = <any>{ value: 'hat' };

      tag().rewriteQuery(newQuery);

      expect(tag().searchBox.value).to.eq(newQuery);
    });
  });

  describe('listenForInput()', () => {
    it('should add input listener', () => {
      tag().searchBox = <any>{
        addEventListener(event: string, cb: Function) {
          expect(event).to.eq('input');
          expect(cb).to.eq(tag().resetToInputValue);
        }
      };

      tag().listenForInput();
    });
  });

  describe('listenForSubmit()', () => {
    it('should add submit listener', () => {
      tag().enterKeyHandlers = [];

      tag().listenForSubmit();

      expect(tag().enterKeyHandlers).to.have.length(1);
      expect(tag().enterKeyHandlers[0]).to.eq(tag().resetToInputValue);
    });
  });

  describe('listenForStaticSearch()', () => {
    it('should add submit listener', () => {
      tag().enterKeyHandlers = [];

      tag().listenForStaticSearch();

      expect(tag().enterKeyHandlers).to.have.length(1);
      expect(tag().enterKeyHandlers[0]).to.eq(tag().setLocation);
    });
  });

  describe('keydownListener()', () => {
    it('should not call onSubmit()', () => {
      sandbox().stub(utils, 'findTag', () => false);
      tag().onSubmit = () => expect.fail();

      tag().keydownListener(<any>{});
    });

    it('should call sayt autocomplete.keyboardListener()', () => {
      const keyboardEvent: any = {};
      const keyboardListener = sandbox().spy((event, submit) => {
        expect(event).to.eq(keyboardEvent);
        expect(submit).to.eq(tag().onSubmit);
      });
      sandbox().stub(utils, 'findTag', () => <any>{
        _tag: { autocomplete: { keyboardListener } }
      });

      tag().keydownListener(keyboardEvent);

      expect(keyboardListener.called).to.be.true;
    });

    it('should call sayt onSubmit()', () => {
      const spy = tag().onSubmit = sandbox().spy();
      sandbox().stub(utils, 'findTag', () => false);

      tag().keydownListener(<any>{ keyCode: 13 });

      expect(spy.called).to.be.true;
    });
  });

  describe('onSubmit()', () => {
    it('should execute enterKeyHandlers', () => {
      tag().enterKeyHandlers = [sinon.spy(), sinon.spy(), sinon.spy()];

      tag().onSubmit();

      tag().enterKeyHandlers.forEach((spy: Sinon.SinonSpy) => expect(spy.called).to.be.true);
    });

    it('should emit autocomplete:hide', () => {
      tag().enterKeyHandlers = [];
      const spy = flux().emit = sinon.spy((event) => expect(event).to.eq(AUTOCOMPLETE_HIDE_EVENT));

      tag().onSubmit();

      expect(spy.called).to.be.true;
    });
  });

  describe('findSearchBox()', () => {
    it('should return from gb-search-box', () => {
      const searchBox = { a: 'b' };
      tag().tags = <any>{ 'gb-search-box': { searchBox } };

      const input = tag().findSearchBox();

      expect(input).to.eq(searchBox);
    });

    it('should return first input field', () => {
      const searchBox = { a: 'b' };
      const querySelector = sinon.spy((selector) => {
        expect(selector).to.eq('input');
        return searchBox;
      });
      tag().tags = <any>{};
      tag().root = <any>{ querySelector };

      const input = tag().findSearchBox();

      expect(input).to.eq(searchBox);
    });
  });

  describe('setLocation()', () => {
    it('should call url.update()', () => {
      const query = 'belts';
      const update = sinon.spy((input) => expect(input).to.eq(query));
      tag().searchBox = <any>{ value: query };
      tag().services = <any>{ url: { update, active: () => true } };

      tag().setLocation();

      expect(update.called).to.be.true;
    });

    it('should call flux.reset()', () => {
      const query = 'scarf';
      const spy = flux().reset = sinon.spy((input): any => expect(input).to.eq(query));
      tag().searchBox = <any>{ value: query };
      tag().services = <any>{ url: { active: () => false } };

      tag().setLocation();

      expect(spy.called).to.be.true;
    });
  });
});
