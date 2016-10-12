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
    beforeEach(() => tag().findSearchBox = () => ({ addEventListener: () => null }));

    it('should find the search box', () => {
      const addEventListener = sinon.spy((event, cb) => {
        expect(event).to.eq('keydown');
        expect(cb).to.eq(tag().keydownListener);
      });
      const searchBox = { addEventListener };
      tag().listenForSubmit = () => null;
      tag().findSearchBox = () => searchBox;

      tag().attachListeners();

      expect(tag().searchBox).to.eq(searchBox);
      expect(addEventListener.called).to.be.true;
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

      tag().attachListeners();
    });

    it('should listen for input event', () => {
      const stub = sinon.stub(tag(), 'listenForInput');
      tag()._config = { autoSearch: true };

      tag().attachListeners();

      expect(stub.called).to.be.true;
    });

    it('should listen for enter keypress event', () => {
      const stub = sandbox().stub(tag(), 'listenForStaticSearch');
      tag()._config = { autoSearch: false, staticSearch: true };

      tag().attachListeners();

      expect(stub.called).to.be.true;
    });

    it('should listen for submit event', () => {
      const stub = sandbox().stub(tag(), 'listenForSubmit');
      tag()._config = { autoSearch: false, staticSearch: false };

      tag().attachListeners();

      expect(stub.called).to.be.true;
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
      const addEventListener = sinon.spy((event: string, cb: Function) => {
        expect(event).to.eq('input');
        expect(cb).to.eq(tag().resetToInputValue);
      });
      tag().searchBox = <any>{ addEventListener };

      tag().listenForInput();

      expect(addEventListener.called).to.be.true;
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

  describe('resetToInputValue()', () => {
    it('should call flux.reset()', (done) => {
      const inputValue = { a: 'b' };
      sandbox().stub(tag(), 'inputValue', () => inputValue);
      flux().reset = (input): any => {
        expect(input).to.eq(inputValue);
        done();
      };

      tag().resetToInputValue();
    });

    it('should call emit tracker event', (done) => {
      sandbox().stub(tag(), 'inputValue');
      flux().reset = (): any => Promise.resolve();
      tag().services = <any>{ tracker: { search: () => done() } };

      tag().resetToInputValue();
    });
  });

  describe('keydownListener()', () => {
    it('should not call onSubmit()', () => {
      const stub = sandbox().stub(utils, 'findTag', () => false);
      tag().onSubmit = () => expect.fail();

      tag().keydownListener(<any>{});

      expect(stub.called).to.be.true;
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
      const stub = sandbox().stub(tag(), 'onSubmit');
      sandbox().stub(utils, 'findTag', () => false);

      tag().keydownListener(<any>{ keyCode: 13 });

      expect(stub.called).to.be.true;
    });
  });

  describe('onSubmit()', () => {
    it('should execute enterKeyHandlers', () => {
      const handlers = [sinon.spy(), sinon.spy(), sinon.spy()];
      tag().enterKeyHandlers = handlers;

      tag().onSubmit();

      expect(handlers).to.have.length(3);
      handlers.forEach((spy: Sinon.SinonSpy) => expect(spy.called).to.be.true);
    });

    it('should emit autocomplete:hide', () => {
      const stub = sandbox().stub(flux(), 'emit', (event) =>
        expect(event).to.eq(AUTOCOMPLETE_HIDE_EVENT));
      tag().enterKeyHandlers = [];

      tag().onSubmit();

      expect(stub.called).to.be.true;
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
      tag().tags = <any>{};
      tag().root = <any>{
        querySelector: (selector) => {
          expect(selector).to.eq('input');
          return searchBox;
        }
      };

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
      const stub = sandbox().stub(flux(), 'reset', (input) => expect(input).to.eq(query));
      tag().searchBox = <any>{ value: query };
      tag().services = <any>{ url: { active: () => false } };

      tag().setLocation();

      expect(stub.called).to.be.true;
    });
  });
});
