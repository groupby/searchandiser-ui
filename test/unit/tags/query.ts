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
      expect(addEventListener).to.have.been.calledWith('keydown', tag().keydownListener);
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

      expect(listenForInput).to.have.been.called;
    });

    it('should listen for enter keypress event', () => {
      const listenForStaticSearch = stub(tag(), 'listenForStaticSearch');
      tag()._config = { autoSearch: false, staticSearch: true };

      tag().attachListeners();

      expect(listenForStaticSearch).to.have.been.called;
    });

    it('should listen for submit event', () => {
      const listenForInput = stub(tag(), 'listenForSubmit');
      tag()._config = { autoSearch: false, staticSearch: false };

      tag().attachListeners();

      expect(listenForInput).to.have.been.called;
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

      expect(addEventListener).to.have.been.calledWith('input', tag().resetToInputValue);
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
      const search = spy();
      const reset = stub(flux(), 'reset').resolves();
      stub(tag(), 'inputValue');
      tag().services = <any>{ tracker: { search } };

      tag().resetToInputValue()
        .then(() => {
          expect(reset).to.have.been.called;
          expect(search).to.have.been.called;
          done();
        });
    });

    it('should check for tracker service', (done) => {
      stub(tag(), 'inputValue');
      stub(flux(), 'reset').resolves();
      tag().services = <any>{};

      tag().resetToInputValue()
        .then(() => done());
    });
  });

  describe('keydownListener()', () => {
    it('should not call onSubmit()', () => {
      const findTag = stub(utils, 'findTag').returns(false);
      tag().onSubmit = () => expect.fail();

      tag().keydownListener(<any>{});

      expect(findTag).to.have.been.called;
    });

    it('should call sayt autocomplete.keyboardListener()', () => {
      const keyboardEvent: any = {};
      const keyboardListener = spy();
      stub(utils, 'findTag', () => <any>{
        _tag: { autocomplete: { keyboardListener } }
      });

      tag().keydownListener(keyboardEvent);

      expect(keyboardListener).to.have.been.calledWith(keyboardEvent, tag().onSubmit);
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
      const handler = spy();
      tag().enterKeyHandlers = [handler, handler, handler];

      tag().onSubmit();

      expect(handler).to.have.been.calledThrice;
    });

    it('should emit autocomplete:hide', () => {
      const emit = stub(flux(), 'emit');
      tag().enterKeyHandlers = [];

      tag().onSubmit();

      expect(emit).to.have.been.calledWith(AUTOCOMPLETE_HIDE_EVENT);
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
      const update = spy();
      flux().query = new FluxQuery('shoes')
        .withSelectedRefinements({ navigationName: 'brand', type: 'Value', value: 'Nike' })
        .skip(19);
      tag().searchBox = <any>{ value: query };
      tag().services = <any>{ url: { update, isActive: () => true } };

      tag().setLocation();

      expect(update).to.have.been.calledWith(sinon.match.instanceOf(FluxQuery));
      expect(update).to.have.been.calledWithMatch({
        raw: {
          query,
          refinements: [],
          skip: 19
        }
      });
    });

    it('should call flux.reset()', () => {
      const query = 'scarf';
      const reset = stub(flux(), 'reset');
      tag().searchBox = <any>{ value: query };
      tag().services = <any>{ url: { isActive: () => false } };

      tag().setLocation();

      expect(reset).to.have.been.calledWith(query);
    });
  });
});
