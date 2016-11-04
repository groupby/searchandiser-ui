import { DEFAULT_CONFIG, Query } from '../../../src/tags/query/gb-query';
import { AUTOCOMPLETE_HIDE_EVENT } from '../../../src/tags/sayt/autocomplete';
import * as utils from '../../../src/utils/common';
import suite from './_suite';
import { expect } from 'chai';
import { Events, Query as FluxQuery } from 'groupby-api';

suite('gb-query', Query, ({
  tag, flux, spy, stub,
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
      const addEventListener = spy();
      const searchBox = { addEventListener };
      tag().listenForSubmit = () => null;
      tag().findSearchBox = () => searchBox;

      tag().attachListeners();

      expect(tag().searchBox).to.eq(searchBox);
      expect(addEventListener.calledWith('keydown', tag().keydownListener)).to.be.true;
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
      const listenForInput = sinon.stub(tag(), 'listenForInput');
      tag()._config = { autoSearch: true };

      tag().attachListeners();

      expect(listenForInput.called).to.be.true;
    });

    it('should listen for enter keypress event', () => {
      const listenForStaticSearch = stub(tag(), 'listenForStaticSearch');
      tag()._config = { autoSearch: false, staticSearch: true };

      tag().attachListeners();

      expect(listenForStaticSearch.called).to.be.true;
    });

    it('should listen for submit event', () => {
      const listenForInput = stub(tag(), 'listenForSubmit');
      tag()._config = { autoSearch: false, staticSearch: false };

      tag().attachListeners();

      expect(listenForInput.called).to.be.true;
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

      expect(addEventListener.calledWith('input', tag().resetToInputValue)).to.be.true;
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
      stub(tag(), 'inputValue').returns(inputValue);
      flux().reset = (input): any => {
        expect(input).to.eq(inputValue);
        done();
      };

      tag().resetToInputValue();
    });

    it('should call emit tracker event', (done) => {
      stub(tag(), 'inputValue');
      const reset = stub(flux(), 'reset').returns(Promise.resolve());
      tag().services = <any>{
        tracker: {
          search: () => {
            expect(reset.called).to.be.true;
            done();
          }
        }
      };

      tag().resetToInputValue();
    });
  });

  describe('keydownListener()', () => {
    it('should not call onSubmit()', () => {
      const findTag = stub(utils, 'findTag').returns(false);
      tag().onSubmit = () => expect.fail();

      tag().keydownListener(<any>{});

      expect(findTag.called).to.be.true;
    });

    it('should call sayt autocomplete.keyboardListener()', () => {
      const keyboardEvent: any = {};
      const keyboardListener = spy();
      stub(utils, 'findTag', () => <any>{
        _tag: { autocomplete: { keyboardListener } }
      });

      tag().keydownListener(keyboardEvent);

      expect(keyboardListener.calledWith(keyboardEvent, tag().onSubmit)).to.be.true;
    });

    it('should call sayt onSubmit()', () => {
      const onSubmit = stub(tag(), 'onSubmit');
      stub(utils, 'findTag', () => false);

      tag().keydownListener(<any>{ keyCode: 13 });

      expect(onSubmit.called).to.be.true;
    });
  });

  describe('onSubmit()', () => {
    it('should execute enterKeyHandlers', () => {
      const handlers = [spy(), spy(), spy()];
      tag().enterKeyHandlers = handlers;

      tag().onSubmit();

      expect(handlers).to.have.length(3);
      handlers.forEach((handler) => expect(handler.called).to.be.true);
    });

    it('should emit autocomplete:hide', () => {
      const emit = stub(flux(), 'emit');
      tag().enterKeyHandlers = [];

      tag().onSubmit();

      expect(emit.calledWith(AUTOCOMPLETE_HIDE_EVENT)).to.be.true;
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
      const fields = ['title', 'id'];
      const update = spy((queryObj: FluxQuery) => {
        expect(queryObj).to.be.an.instanceof(FluxQuery);
        expect(queryObj.raw.query).to.eq(query);
        expect(queryObj.raw.fields).to.eql(fields);
      });
      flux().query = new FluxQuery('shoes').withFields(...fields);
      tag().searchBox = <any>{ value: query };
      tag().services = <any>{ url: { update, isActive: () => true } };

      tag().setLocation();

      expect(update.called).to.be.true;
    });

    it('should call flux.reset()', () => {
      const query = 'scarf';
      const reset = stub(flux(), 'reset');
      tag().searchBox = <any>{ value: query };
      tag().services = <any>{ url: { isActive: () => false } };

      tag().setLocation();

      expect(reset.calledWith(query)).to.be.true;
    });
  });
});
