import { RESET_EVENT } from '../../../src/services/search';
import { META, Query } from '../../../src/tags/query/gb-query';
import { AUTOCOMPLETE_HIDE_EVENT } from '../../../src/tags/sayt/autocomplete';
import * as utils from '../../../src/utils/common';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-query', Query, ({
  tag, flux, spy, stub,
  expectSubscriptions,
  itShouldHaveMeta
}) => {
  itShouldHaveMeta(Query, META);

  describe('init()', () => {
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

  describe('setDefaults()', () => {
    it('should set defaults', () => {
      tag().setDefaults();

      expect(tag().enterKeyHandlers).to.eql([]);
    });
  });

  describe('attachListeners()', () => {
    beforeEach(() => tag().findSearchBox = () => <any>({ addEventListener: () => null }));

    it('should find the search box', () => {
      const addEventListener = spy();
      const searchBox: any = { addEventListener };
      tag().listenForSubmit = () => null;
      tag().findSearchBox = () => searchBox;

      tag().attachListeners();

      expect(tag().searchBox).to.eq(searchBox);
      expect(addEventListener).to.be.calledWith('keydown', tag().keydownListener);
    });

    it('should attach sayt listeners', (done) => {
      tag().sayt = true;
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
      const listenForInput = stub(tag(), 'listenForInput');
      tag().autoSearch = true;

      tag().attachListeners();

      expect(listenForInput).to.be.called;
    });

    it('should listen for submit event', () => {
      const listenForSubmit = stub(tag(), 'listenForSubmit');
      tag().autoSearch = false;

      tag().attachListeners();

      expect(listenForSubmit).to.be.called;
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
      const addEventListener = spy();
      tag().searchBox = <any>{ addEventListener };

      tag().listenForInput();

      expect(addEventListener).to.be.calledWith('input', tag().updateQuery);
    });
  });

  describe('listenForSubmit()', () => {
    it('should add submit listener', () => {
      tag().enterKeyHandlers = [];

      tag().listenForSubmit();

      expect(tag().enterKeyHandlers).to.have.length(1);
      expect(tag().enterKeyHandlers[0]).to.eq(tag().updateQuery);
    });
  });

  describe('updateQuery()', () => {
    it('should emit search:reset', () => {
      const query = 'red apple';
      const emit = stub(flux(), 'emit');
      tag().inputValue = () => query;

      tag().updateQuery();

      expect(emit).to.be.calledWith(RESET_EVENT);
    });
  });

  describe('keydownListener()', () => {
    it('should not call onSubmit()', () => {
      tag().sayt = false;
      tag().onSubmit = () => expect.fail();

      tag().keydownListener(<any>{});
    });

    it('should call sayt autocomplete.keyboardListener()', () => {
      const keyboardEvent: any = {};
      const keyboardListener = spy();
      tag().tags = <any>{['gb-sayt']: { autocomplete: { keyboardListener } }};
      tag().sayt = true;

      tag().keydownListener(keyboardEvent);

      expect(keyboardListener).to.be.calledWith(keyboardEvent, tag().onSubmit);
    });

    it('should call sayt onSubmit()', () => {
      const onSubmit = stub(tag(), 'onSubmit');
      stub(utils, 'findTag');

      tag().keydownListener(<any>{ keyCode: 13 });

      expect(onSubmit.called).to.be.true;
    });
  });

  describe('onSubmit()', () => {
    it('should execute enterKeyHandlers', () => {
      const handler = spy();
      tag().enterKeyHandlers = [handler, handler, handler];

      tag().onSubmit();

      expect(handler).to.be.calledThrice;
    });

    it('should emit autocomplete:hide', () => {
      const emit = stub(flux(), 'emit');
      tag().enterKeyHandlers = [];

      tag().onSubmit();

      expect(emit).to.be.calledWith(AUTOCOMPLETE_HIDE_EVENT);
    });
  });

  describe('findSearchBox()', () => {
    it('should return from gb-search-box', () => {
      const searchBox = { a: 'b' };
      tag().tags = <any>{ 'gb-search-box': { refs: { searchBox } } };

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

  describe('inputValue()', () => {
    it('should return searchBox.value', () => {
      const query = 'red shoes';
      tag().searchBox = <any>{ value: query };

      expect(tag().inputValue()).to.eq(query);
    });
  });
});
