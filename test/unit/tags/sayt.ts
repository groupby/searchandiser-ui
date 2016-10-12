import { Autocomplete, AUTOCOMPLETE_HIDE_EVENT } from '../../../src/tags/sayt/autocomplete';
import { DEFAULT_CONFIG, MIN_DELAY, Sayt } from '../../../src/tags/sayt/gb-sayt';
import * as utils from '../../../src/utils/common';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-sayt', Sayt, ({
  flux, tag, sandbox,
  expectSubscriptions,
  itShouldConfigure
}) => {

  describe('init()', () => {
    const STRUCTURE = {
      title: 'title',
      price: 'price',
      image: 'image'
    };
    let sayt;

    beforeEach(() => {
      tag().config = { structure: STRUCTURE };
      sayt = tag().sayt = { configure: () => null };
    });

    itShouldConfigure(DEFAULT_CONFIG);

    it('should have default values', () => {
      tag().init();

      expect(tag().struct).to.eql(STRUCTURE);
      expect(tag().showProducts).to.be.true;
    });

    it('should take configuration overrides from global config', () => {
      const structure = { image: 'thumbnail', url: 'url' };
      tag().configure = () => tag()._config = { structure, products: 0 };

      tag().init();

      expect(tag().struct).to.eql(Object.assign({}, STRUCTURE, structure));
      expect(tag().showProducts).to.be.false;
    });

    it('should configure sayt', () => {
      const generated: any = { a: 'b', c: 'd' };
      const spy = sayt.configure = sinon.spy((config) => expect(config).to.eql(generated));
      tag().generateSaytConfig = () => generated;

      tag().init();

      expect(spy.called).to.be.true;
    });

    it('should listen for mount event', () => {
      expectSubscriptions(() => tag().init(), {
        mount: tag().initializeAutocomplete
      }, tag());
    });

    it('should listen for autocomplete:hide event', () => {
      expectSubscriptions(() => tag().init(), {
        [AUTOCOMPLETE_HIDE_EVENT]: tag().reset
      });
    });
  });

  describe('initializeAutocomplete()', () => {
    it('should create a new instance of Autocomplete', () => {
      tag().initializeAutocomplete();

      expect(tag().autocomplete).to.be.an.instanceof(Autocomplete);
    });
  });

  describe('generateSaytConfig()', () => {
    it('should generate configuration', () => {
      const customerId = 'mycustomer';
      const collection = 'mycollection';
      const area = 'MyArea';
      tag().config = { customerId, collection, area };
      tag()._config = { queries: 2, products: 3, https: true };

      const config = tag().generateSaytConfig();

      expect(config).to.eql({
        subdomain: customerId,
        collection,
        autocomplete: { numSearchTerms: 2 },
        productSearch: { area, numProducts: 3 },
        https: true
      });
    });

    it('should generate configuration with HTTPS', () => {
      tag()._config = { https: true };

      const config = tag().generateSaytConfig();

      expect(config.https).to.be.true;
    });
  });

  describe('reset()', () => {
    it('should reset autocomplete', () => {
      const reset = sinon.spy();
      const spy = tag().update = sinon.spy((data) => {
        expect(data.queries).to.be.null;
        expect(data.navigations).to.be.null;
        expect(data.products).to.be.null;
      });
      tag().autocomplete = <any>{ reset };

      tag().reset();

      expect(reset.called).to.be.true;
      expect(spy.called).to.be.true;
    });
  });

  describe('fetchSuggestions()', () => {
    it('should fetch suggestions and process them', (done) => {
      const newQuery = 'red sneakers';
      const suggestions = { a: 'b', c: 'd' };
      tag().sayt = {
        autocomplete: (query) => {
          expect(query).to.eq(newQuery);
          return Promise.resolve({ result: suggestions });
        }
      };
      tag().handleSuggestions = ({ result, originalQuery }) => {
        expect(result).to.eq(suggestions);
        expect(originalQuery).to.eq(newQuery);
        done();
      };

      tag().fetchSuggestions(newQuery);
    });
  });

  describe('handleSuggestions()', () => {
    it('should update with originalQuery', () => {
      const newQuery = 'red sneakers';
      const result = { a: 'b', c: 'd' };
      const stub = sandbox().stub(tag(), 'processResults', (res) => expect(res).to.eql(result));
      const spy =
        tag().update =
        sinon.spy((data) => expect(data.originalQuery).to.eq(newQuery));
      tag().searchProducts = () => expect.fail();

      tag().handleSuggestions({ result, originalQuery: newQuery });

      expect(stub.called).to.be.true;
      expect(spy.called).to.be.true;
    });

    it('should call searchProducts()', (done) => {
      const query = 'red sneakers';
      tag().showProducts = true;
      tag().queries = [{ value: query }];
      tag().processResults = () => null;
      tag().update = () => null;
      tag().searchProducts = (productQuery) => {
        expect(productQuery).to.eq(query);
        done();
      };

      tag().handleSuggestions({ result: {}, originalQuery: undefined });
    });
  });

  describe('searchProducts()', () => {
    it('should search products', (done) => {
      const suggestion = 'red sneakers';
      const products = [{ a: 'b' }, { c: 'd' }];
      const productSearch = sinon.spy((query) => {
        expect(query).to.eq(suggestion);
        return Promise.resolve({ result: { products } });
      });
      tag().sayt = { productSearch };
      tag().update = (data) => {
        expect(data.products).to.eq(products);
        expect(productSearch.called).to.be.true;
        done();
      };
      tag().showProducts = true;

      tag().searchProducts(suggestion);
    });

    it('should not search products', () => {
      tag().sayt = { productSearch: () => expect.fail() };
      tag().showProducts = false;

      tag().searchProducts(undefined);
    });
  });

  describe('rewriteQuery()', () => {
    it('should emit rewrite_query', () => {
      const newQuery = 'slippers';
      const stub = sandbox().stub(flux(), 'emit', (event, query) => {
        expect(event).to.eq(Events.REWRITE_QUERY);
        expect(query).to.eq(newQuery);
      });
      flux().query.withQuery(newQuery);

      tag().rewriteQuery(newQuery);

      expect(stub.called).to.be.true;
    });
  });

  describe('notifier()', () => {
    it('should fetch suggestions and rewrite query', () => {
      const newQuery = 'cool shoes';
      const searchProducts = sandbox().stub(tag(), 'searchProducts', (query) => expect(query).to.eq(newQuery));
      const rewriteQuery = sandbox().stub(tag(), 'rewriteQuery', (query) => expect(query).to.eq(newQuery));
      tag()._config = { autoSearch: true };

      tag().notifier(newQuery);

      expect(searchProducts.called).to.be.true;
      expect(rewriteQuery.called).to.be.true;
    });

    it('should fetch rewrite query but not fetch suggestions', () => {
      const newQuery = 'cool shoes';
      const stub = sandbox().stub(tag(), 'rewriteQuery', (query) => expect(query).to.eq(newQuery));
      tag()._config = { autoSearch: false };
      tag().searchProducts = () => expect.fail();

      tag().notifier(newQuery);

      expect(stub.called).to.be.true;
    });
  });

  describe('searchRefinement()', () => {
    it('should refine', () => {
      const target = { a: 'b' };
      const resetRecall = sandbox().stub(flux(), 'resetRecall');
      const refine = sandbox().stub(tag(), 'refine', (targetElement, query) => {
        expect(targetElement).to.eq(target);
        expect(query).to.eq('');
      });

      tag().searchRefinement(<any>{ target });

      expect(resetRecall.called).to.be.true;
      expect(refine.called).to.be.true;
    });
  });

  describe('searchCategory()', () => {
    it('should refine with query', () => {
      const target = { a: 'b' };
      const resetRecall = sandbox().stub(flux(), 'resetRecall');
      const refine = sandbox().stub(tag(), 'refine', (targetElement, query) => {
        expect(targetElement).to.eq(target);
        expect(query).to.eq('boots');
      });
      tag().originalQuery = 'boots';

      tag().searchCategory(<any>{ target });

      expect(resetRecall.called).to.be.true;
      expect(refine.called).to.be.true;
    });
  });

  describe('highlightCurrentQuery()', () => {
    it('should apply regex replacement with the current query', () => {
      tag().originalQuery = 'blue sneakers';
      tag()._config = { highlight: true };

      const highlighted = tag().highlightCurrentQuery('hi-top blue sneakers', '<b>$&</b>');

      expect(highlighted).to.eq('hi-top <b>blue sneakers</b>');
    });

    it('should apply regex replacement with slashes', () => {
      const currentQuery = 'hi-top blue sneakers';
      tag().originalQuery = 'blue sneakers\\';
      tag()._config = { highlight: true };

      const highlight = () => tag().highlightCurrentQuery(currentQuery, '<b>$&</b>');

      expect(highlight).to.not.throw();
      expect(highlight()).to.eq('hi-top blue sneakers');
    });

    it('should not apply regex replacement', () => {
      tag().originalQuery = 'blue sneakers';
      tag()._config = { highlight: false };

      const highlighted = tag().highlightCurrentQuery('hi-top blue sneakers', '<b>$&</b>');

      expect(highlighted).to.eq('hi-top blue sneakers');
    });
  });

  describe('enhanceCategoryQuery()', () => {
    it('should insert category query into template', () => {
      tag()._config = { categoryField: 'category.value' };

      const highlighted = tag().enhanceCategoryQuery({
        value: 'blue sneakers',
        category: 'Footwear'
      });

      expect(highlighted).to.eq('<b>blue sneakers</b> in <span class="gb-category-query">Footwear</span>');
    });
  });

  describe('search()', () => {
    it('should update results with suggestion as query', () => {
      const suggestion = 'red heels';
      tag()._config = {};
      const rewriteQuery = sandbox().stub(tag(), 'rewriteQuery', (query) => expect(query).to.eq(suggestion));
      const reset = sandbox().stub(flux(), 'reset', (query) => expect(query).to.eq(suggestion));

      tag().search(<any>{
        target: {
          tagName: 'GB-SAYT-LINK',
          dataset: { value: suggestion }
        }
      });

      expect(rewriteQuery.called).to.be.true;
      expect(reset.called).to.be.true;
    });

    it('should search for the gb-sayt-link node', () => {
      const suggestion = 'red heels';
      tag()._config = {};
      const rewriteQuery = sandbox().stub(tag(), 'rewriteQuery', (query) => expect(query).to.eq(suggestion));
      const reset = sandbox().stub(flux(), 'reset', (query) => expect(query).to.eq(suggestion));

      tag().search(<any>{
        target: {
          parentElement: {
            parentElement: {
              tagName: 'GB-SAYT-LINK',
              dataset: { value: suggestion }
            }
          }
        }
      });

      expect(rewriteQuery.called).to.be.true;
      expect(reset.called).to.be.true;
    });

    it('should perform a static search', () => {
      const suggestion = 'red heels';
      const update = sinon.spy((query, refinements) => {
        expect(query).to.eq(suggestion);
        expect(refinements).to.eql([]);
      });
      tag().rewriteQuery = () => expect.fail();
      tag().services = <any>{ url: { active: () => true, update } };
      tag()._config = { staticSearch: true };

      tag().search(<any>{
        target: {
          tagName: 'GB-SAYT-LINK',
          dataset: { value: suggestion }
        }
      });

      expect(update.called).to.be.true;
    });
  });

  describe('refine()', () => {
    it('should update results with suggestion and refinement', () => {
      const suggestion = 'red heels';
      const field = 'size';
      const refinement = 8;
      const rewrite = sandbox().stub(flux(), 'rewrite', (query, config) => {
        expect(query).to.eq(suggestion);
        expect(config.skipSearch).to.be.true;
      });
      const refine = sandbox().stub(flux(), 'refine', (selectedRefinement) =>
        expect(selectedRefinement).to.eql({
          navigationName: field,
          value: refinement,
          type: 'Value'
        }));
      tag()._config = {};

      tag().refine(<any>{
        tagName: 'GB-SAYT-LINK',
        dataset: { field, refinement }
      }, suggestion);

      expect(rewrite.called).to.be.true;
      expect(refine.called).to.be.true;
    });

    it('should skip refinement and do query', () => {
      const suggestion = 'red heels';
      const field = 'size';
      const refinement = 8;
      const stub = sandbox().stub(flux(), 'reset', (query): any =>
        expect(query).to.eq(suggestion));
      flux().rewrite = (): any => expect.fail();
      tag()._config = {};

      tag().refine(<any>{
        tagName: 'GB-SAYT-LINK',
        dataset: { field, refinement, norefine: true }
      }, suggestion);

      expect(stub.called).to.be.true;
    });

    it('should perform a static refinement', () => {
      const suggestion = 'red heels';
      const field = 'size';
      const refinement = 8;
      const update = sinon.spy((query, refinements) => {
        expect(query).to.eq(suggestion);
        expect(refinements).to.eql([{ navigationName: field, value: refinement, type: 'Value' }]);
      });
      flux().rewrite = (): any => expect.fail();
      tag().services = <any>{ url: { update, active: () => true } };
      tag()._config = { staticSearch: true };

      tag().refine(<any>{
        tagName: 'GB-SAYT-LINK',
        dataset: { field, refinement }
      }, suggestion);

      expect(update.called).to.be.true;
    });
  });

  describe('processResults()', () => {
    it('should update with defaults', () => {
      const spy =
        tag().update =
        sinon.spy(({ results, queries, navigations, categoryResults }) => {
          expect(results).to.eql({});
          expect(queries).to.be.undefined;
          expect(navigations).to.eql([]);
          expect(categoryResults).to.eql([]);
          expect(tag().matchesInput).to.not.be.ok;
        });

      tag().processResults({});

      expect(spy.called).to.be.true;
    });

    it('should extract and filter navigations', () => {
      const newNavigations = [{ name: 'brand' }, { name: 'colour' }];
      const spy =
        tag().update =
        sinon.spy(({ navigations }) =>
          expect(navigations).to.eql([{ name: 'colour', displayName: 'colour' }]));
      tag()._config = { allowedNavigations: ['colour'], navigationNames: {} };

      tag().processResults({ navigations: newNavigations });

      expect(spy.called).to.be.true;
    });

    it('should rename navigations', () => {
      const newNavigations = [{ name: 'colour' }];
      const spy =
        tag().update =
        sinon.spy(({ navigations }) =>
          expect(navigations).to.eql([{ name: 'colour', displayName: 'Colour' }]));
      tag()._config = { allowedNavigations: ['colour'], navigationNames: { colour: 'Colour' } };

      tag().processResults({ navigations: newNavigations });

      expect(spy.called).to.be.true;
    });

    it('should match input', () => {
      const value = tag().originalQuery = 'red boots';
      const additionalInfo = { a: 'b' };
      const categories = ['a', 'b'];
      const searchTerms = [{ value, additionalInfo }, { value: 'other' }];
      const spy =
        tag().update =
        sinon.spy(({ categoryResults }) => expect(categoryResults).to.eq(categories));
      tag().extractCategoryResults = (categoryQuery) => {
        expect(categoryQuery.additionalInfo).to.eq(additionalInfo);
        expect(categoryQuery.value).to.eq(value);
        return categories;
      };

      tag().processResults({ searchTerms });

      expect(tag().matchesInput).to.be.true;
      expect(searchTerms.length).to.eq(1);
      expect(spy.called).to.be.true;
    });

    it('should not match input', () => {
      const searchTerms = [{ value: 'red boots' }, { value: 'other' }];
      const spy =
        tag().update =
        sinon.spy(({ categoryResults }) => expect(categoryResults).to.eql([]));
      tag().originalQuery = 'blue socks';

      tag().processResults({ searchTerms });

      expect(tag().matchesInput).to.be.false;
      expect(searchTerms.length).to.eq(2);
      expect(spy.called).to.be.true;
    });

    it('should match case-insensitive input', () => {
      const value = 'red boots';
      const additionalInfo = { a: 'b' };
      const searchTerms = [{ value, additionalInfo }, { value: 'other' }];
      const categoryRes: any = { c: 'd' };
      const spy =
        tag().update =
        sinon.spy(({ categoryResults }) => expect(categoryResults).to.eq(categoryRes));
      tag().originalQuery = 'Red Boots';
      tag().extractCategoryResults = () => categoryRes;

      tag().processResults({ searchTerms });

      expect(tag().matchesInput).to.be.true;
      expect(spy.called).to.be.true;
    });
  });

  describe('extractCategoryResults()', () => {
    it('should return empty array if not configured', () => {
      tag()._config = {};

      expect(tag().extractCategoryResults({})).to.eql([]);
    });

    it('should extract categories for configured field', () => {
      const allCategoriesLabel = 'All Categories';
      const categoryField = 'department';
      const query = tag().originalQuery = 'tool';
      tag()._config = { allCategoriesLabel, categoryField };

      const categories = tag().extractCategoryResults({
        value: query,
        additionalInfo: { [categoryField]: ['Power Tools', 'Patio Furniture', 'Camping'] }
      });

      expect(categories).to.eql([
        { category: allCategoriesLabel, value: 'tool', noRefine: true },
        { category: 'Power Tools', value: 'tool' },
        { category: 'Patio Furniture', value: 'tool' },
        { category: 'Camping', value: 'tool' }
      ]);
    });
  });

  describe('listenForInput()', () => {
    const MOCK_QUERY: any = { searchBox: { addEventListener: () => null } };

    it('should disable autocomplete and add input listener', () => {
      const searchFunc = () => null;
      const debouncedSearchFunc = () => null;
      const addEventListener = sinon.spy((event, cb) => {
        expect(event).to.eq('input');
        expect(cb).to.eq(debouncedSearchFunc);
      });
      const searchBox = { autocomplete: 'on', addEventListener };
      const queryTag: any = { searchBox };
      sandbox().stub(utils, 'debounce', (func) => {
        expect(func).to.eq(searchFunc);
        return debouncedSearchFunc;
      });
      tag().debouncedSearch = (input) => {
        expect(input).to.eq(searchBox);
        return searchFunc;
      };

      tag().listenForInput(queryTag);

      expect(searchBox.autocomplete).to.eq('off');
      expect(addEventListener.called).to.be.true;
    });

    it('should debounce with the configured delay', () => {
      const saytDelay = 1423;
      const stub = sandbox().stub(utils, 'debounce', (func, delay) =>
        expect(delay).to.eq(saytDelay));
      tag()._config = { delay: saytDelay };

      tag().listenForInput(MOCK_QUERY);

      expect(stub.called).to.be.true;
    });

    it('should debounce with minimum delay of 100', () => {
      const stub = sandbox().stub(utils, 'debounce', (func, delay) =>
        expect(delay).to.eq(MIN_DELAY));
      tag()._config = { delay: 12 };

      tag().listenForInput(MOCK_QUERY);

      expect(stub.called).to.be.true;
    });

    it('should attach click listener to document', () => {
      const stub = sandbox().stub(document, 'addEventListener', (event, cb) => {
        expect(event).to.eq('click');
        expect(cb).to.eq(tag().reset);
      });

      tag().listenForInput(MOCK_QUERY);

      expect(stub.called).to.be.true;
    });
  });

  describe('debouncedSearch()', () => {
    it('should return a function', () => {
      expect(tag().debouncedSearch(<any>{ value: '' })).to.be.a('function');
    });

    it('should return a function that calls reset()', () => {
      const func = tag().debouncedSearch(<any>{ value: '' });
      const stub = sandbox().stub(tag(), 'reset');
      tag()._config = { minimumCharacters: 3 };

      func();

      expect(stub.called).to.be.true;
    });

    it('should return a function that calls fetchSuggestions()', () => {
      const value = 'nike snea';
      const func = tag().debouncedSearch(<any>{ value });
      const stub = sandbox().stub(tag(), 'fetchSuggestions', (val) => expect(val).to.eq(value));
      tag()._config = { minimumCharacters: 3 };

      func();

      expect(stub.called).to.be.true;
    });
  });
});
