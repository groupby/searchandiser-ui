import { Autocomplete, AUTOCOMPLETE_HIDE_EVENT } from '../../../src/tags/sayt/autocomplete';
import { DEFAULT_CONFIG, MIN_DELAY, Sayt } from '../../../src/tags/sayt/gb-sayt';
import * as utils from '../../../src/utils/common';
import { refinement } from '../../utils/fixtures';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-sayt', Sayt, ({
  flux, tag, spy, stub,
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
      const configure = sayt.configure = spy();
      tag().generateSaytConfig = () => generated;

      tag().init();

      expect(configure.calledWith(generated)).to.be.true;
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
      const language = 'en';
      tag().config = { customerId, collection, area };
      tag()._config = { queries: 2, products: 3, https: true, language };

      const config = tag().generateSaytConfig();

      expect(config).to.eql({
        subdomain: customerId,
        collection,
        autocomplete: { language, numSearchTerms: 2 },
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
      const reset = spy();
      const update = tag().update = spy();
      tag().autocomplete = <any>{ reset };

      tag().reset();

      expect(reset.called).to.be.true;
      expect(update.calledWith({
        queries: null,
        navigations: null,
        products: null
      })).to.be.true;
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
      const originalQuery = 'red sneakers';
      const result = { a: 'b', c: 'd' };
      const processResults = stub(tag(), 'processResults');
      const update = tag().update = spy();
      tag().searchProducts = () => expect.fail();

      tag().handleSuggestions({ result, originalQuery });

      expect(processResults.calledWith(result)).to.be.true;
      expect(update.calledWith({ originalQuery })).to.be.true;
    });

    it('should call searchProducts()', (done) => {
      const query = 'red sneakers';
      const processResults = stub(tag(), 'processResults');
      const update = tag().update = spy();
      tag().showProducts = true;
      tag().queries = [{ value: query }];
      tag().searchProducts = (productQuery) => {
        expect(processResults.called).to.be.true;
        expect(update.called).to.be.true;
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
      const productSearch = spy(() => Promise.resolve({ result: { products } }));
      tag().sayt = { productSearch };
      tag().update = (data) => {
        expect(data).to.eql({ products });
        expect(productSearch.calledWith(suggestion, { refinements: undefined })).to.be.true;
        done();
      };
      tag().showProducts = true;

      tag().searchProducts(suggestion);
    });

    it('should search products with empty query', (done) => {
      const productSearch = spy((query) => {
        expect(query).to.eq('');
        done();
      });
      tag().sayt = { productSearch };
      tag().showProducts = true;

      tag().searchProducts();
    });

    it('should search products with refinements', (done) => {
      const suggestion = 'red sneakers';
      const refinements = '~Brand=Nike';
      const productSearch = spy((query, options) => {
        expect(query).to.eq(suggestion);
        expect(options).to.eql({ refinements });
        done();
      });
      tag().sayt = { productSearch };
      tag().showProducts = true;

      tag().searchProducts(suggestion, refinements);
    });

    it('should not search products', () => {
      tag().sayt = { productSearch: () => expect.fail() };
      tag().showProducts = false;

      tag().searchProducts(undefined);
    });
  });

  describe('rewriteQuery()', () => {
    it('should emit rewrite_query', () => {
      const query = 'slippers';
      const emit = stub(flux(), 'emit');
      flux().query.withQuery(query);

      tag().rewriteQuery(query);

      expect(emit.calledWith(Events.REWRITE_QUERY, query)).to.be.true;
    });
  });

  describe('notifier()', () => {
    it('should fetch suggestions and rewrite query', () => {
      const query = 'cool shoes';
      const searchProducts = stub(tag(), 'searchProducts');
      const rewriteQuery = stub(tag(), 'rewriteQuery');
      tag()._config = { autoSearch: true };

      tag().notifier(query);

      expect(searchProducts.calledWith(query, undefined)).to.be.true;
      expect(rewriteQuery.calledWith(query)).to.be.true;
    });

    it('should fetch suggestions with refinements', () => {
      const query = 'cool shoes';
      const searchProducts = stub(tag(), 'searchProducts');
      tag().rewriteQuery = () => null;
      tag()._config = { autoSearch: true, categoryField: 'size' };

      tag().notifier(query, 'Medium');

      expect(searchProducts.calledWith(query, '~size=Medium')).to.be.true;
    });

    it('should fetch suggestions with refinements and overwite query', () => {
      const searchProducts = stub(tag(), 'searchProducts');
      tag().rewriteQuery = () => null;
      tag()._config = { autoSearch: true, categoryField: 'size' };

      tag().notifier('Color: Blue', 'Blue', 'color');

      expect(searchProducts.calledWith('', '~color=Blue')).to.be.true;
    });

    it('should fetch rewrite query but not fetch suggestions', () => {
      const query = 'cool shoes';
      const rewriteQuery = stub(tag(), 'rewriteQuery');
      tag()._config = { autoSearch: false };
      tag().searchProducts = () => expect.fail();

      tag().notifier(query);

      expect(rewriteQuery.calledWith(query)).to.be.true;
    });
  });

  describe('searchRefinement()', () => {
    it('should refine', () => {
      const target = { a: 'b' };
      const resetRecall = stub(flux(), 'resetRecall');
      const refine = stub(tag(), 'refine');

      tag().searchRefinement(<any>{ target });

      expect(resetRecall.called).to.be.true;
      expect(refine.calledWith(target, '')).to.be.true;
    });
  });

  describe('searchCategory()', () => {
    it('should refine with query', () => {
      const target = { a: 'b' };
      const resetRecall = stub(flux(), 'resetRecall');
      const refine = stub(tag(), 'refine');
      tag().originalQuery = 'boots';

      tag().searchCategory(<any>{ target });

      expect(resetRecall.called).to.be.true;
      expect(refine.calledWith(target, 'boots')).to.be.true;
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
    it('should update results with suggestion as query', (done) => {
      const suggestion = 'red heels';
      const rewriteQuery = stub(tag(), 'rewriteQuery');
      const reset = stub(flux(), 'reset').returns(Promise.resolve());
      tag()._config = {};
      tag().services = <any>{
        tracker: {
          sayt: () => {
            expect(rewriteQuery.calledWith(suggestion)).to.be.true;
            expect(reset.calledWith(suggestion)).to.be.true;
            done();
          }
        }
      };

      tag().search(<any>{
        target: {
          tagName: 'GB-SAYT-LINK',
          dataset: { value: suggestion }
        }
      });
    });

    it('should search for the gb-sayt-link node', () => {
      const suggestion = 'red heels';
      const rewriteQuery = stub(tag(), 'rewriteQuery');
      const reset = stub(flux(), 'reset').returns(Promise.resolve());
      tag()._config = {};

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

      expect(rewriteQuery.calledWith(suggestion)).to.be.true;
      expect(reset.calledWith(suggestion)).to.be.true;
    });

    it('should perform a static search', () => {
      const suggestion = 'red heels';
      const update = spy();
      tag().rewriteQuery = () => expect.fail();
      tag().services = <any>{ url: { active: () => true, update } };
      tag()._config = { staticSearch: true };

      tag().search(<any>{
        target: {
          tagName: 'GB-SAYT-LINK',
          dataset: { value: suggestion }
        }
      });

      expect(update.calledWith(suggestion, [])).to.be.true;
    });
  });

  describe('refine()', () => {
    it('should update results with suggestion and refinement', (done) => {
      const suggestion = 'red heels';
      const field = 'size';
      const value = 'medium';
      const rewrite = stub(flux(), 'rewrite');
      const refine = stub(flux(), 'refine').returns(Promise.resolve());
      tag()._config = {};
      tag().services = <any>{
        tracker: {
          sayt: () => {
            expect(rewrite.calledWith(suggestion, { skipSearch: true })).to.be.true;
            expect(refine.calledWith(refinement(field, value))).to.be.true;
            done();
          }
        }
      };

      tag().refine(<any>{
        tagName: 'GB-SAYT-LINK',
        dataset: { field, refinement: value }
      }, suggestion);
    });

    it('should skip refinement and do query', (done) => {
      const suggestion = 'red heels';
      const field = 'size';
      const refinement = 8;
      const reset = stub(flux(), 'reset').returns(Promise.resolve());
      flux().rewrite = (): any => expect.fail();
      tag()._config = {};
      tag().services = <any>{
        tracker: {
          sayt: () => {
            expect(reset.calledWith(suggestion)).to.be.true;
            done();
          }
        }
      };

      tag().refine(<any>{
        tagName: 'GB-SAYT-LINK',
        dataset: { field, refinement, norefine: true }
      }, suggestion);
    });

    it('should perform a static refinement', () => {
      const suggestion = 'red heels';
      const field = 'size';
      const value = 8;
      const update = spy();
      flux().rewrite = (): any => expect.fail();
      tag().services = <any>{ url: { update, active: () => true } };
      tag()._config = { staticSearch: true };

      tag().refine(<any>{
        tagName: 'GB-SAYT-LINK',
        dataset: { field, refinement: value }
      }, suggestion);

      expect(update.calledWith(suggestion, [refinement(field, value)])).to.be.true;
    });
  });

  describe('processResults()', () => {
    it('should update with defaults', () => {
      const update = tag().update = spy();

      tag().processResults({});

      expect(update.calledWith({
        results: {},
        queries: undefined,
        navigations: [],
        categoryResults: []
      })).to.be.true;
      expect(tag().matchesInput).to.not.be.ok;
    });

    it('should extract and filter navigations', () => {
      const newNavigations = [{ name: 'brand' }, { name: 'colour' }];
      const update =
        tag().update =
        spy(({ navigations }) =>
          expect(navigations).to.eql([{ name: 'colour', displayName: 'colour' }]));
      tag()._config = { allowedNavigations: ['colour'], navigationNames: {} };

      tag().processResults({ navigations: newNavigations });

      expect(update.called).to.be.true;
    });

    it('should rename navigations', () => {
      const newNavigations = [{ name: 'colour' }];
      const update =
        tag().update =
        spy(({ navigations }) =>
          expect(navigations).to.eql([{ name: 'colour', displayName: 'Colour' }]));
      tag()._config = { allowedNavigations: ['colour'], navigationNames: { colour: 'Colour' } };

      tag().processResults({ navigations: newNavigations });

      expect(update.called).to.be.true;
    });

    it('should match input', () => {
      const value = tag().originalQuery = 'red boots';
      const additionalInfo = { a: 'b' };
      const categories = ['a', 'b'];
      const searchTerms = [{ value, additionalInfo }, { value: 'other' }];
      const update =
        tag().update =
        spy(({ categoryResults }) => expect(categoryResults).to.eq(categories));
      tag().extractCategoryResults = (categoryQuery) => {
        expect(categoryQuery.additionalInfo).to.eq(additionalInfo);
        expect(categoryQuery.value).to.eq(value);
        return categories;
      };

      tag().processResults({ searchTerms });

      expect(tag().matchesInput).to.be.true;
      expect(searchTerms.length).to.eq(1);
      expect(update.called).to.be.true;
    });

    it('should not match input', () => {
      const searchTerms = [{ value: 'red boots' }, { value: 'other' }];
      const update =
        tag().update =
        spy(({ categoryResults }) => expect(categoryResults).to.eql([]));
      tag().originalQuery = 'blue socks';

      tag().processResults({ searchTerms });

      expect(tag().matchesInput).to.be.false;
      expect(searchTerms.length).to.eq(2);
      expect(update.called).to.be.true;
    });

    it('should match case-insensitive input', () => {
      const value = 'red boots';
      const additionalInfo = { a: 'b' };
      const searchTerms = [{ value, additionalInfo }, { value: 'other' }];
      const categoryRes: any = { c: 'd' };
      const update =
        tag().update =
        spy(({ categoryResults }) => expect(categoryResults).to.eq(categoryRes));
      tag().originalQuery = 'Red Boots';
      tag().extractCategoryResults = () => categoryRes;

      tag().processResults({ searchTerms });

      expect(tag().matchesInput).to.be.true;
      expect(update.called).to.be.true;
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
      const addEventListener = spy();
      const searchBox = { autocomplete: 'on', addEventListener };
      const queryTag: any = { searchBox };
      stub(utils, 'debounce', (func) => {
        expect(func).to.eq(searchFunc);
        return debouncedSearchFunc;
      });
      tag().debouncedSearch = (input) => {
        expect(input).to.eq(searchBox);
        return searchFunc;
      };

      tag().listenForInput(queryTag);

      expect(searchBox.autocomplete).to.eq('off');
      expect(addEventListener.calledWith('input', debouncedSearchFunc)).to.be.true;
    });

    it('should debounce with the configured delay', () => {
      const saytDelay = 1423;
      const debounce = stub(utils, 'debounce', (func, delay) =>
        expect(delay).to.eq(saytDelay));
      tag()._config = { delay: saytDelay };

      tag().listenForInput(MOCK_QUERY);

      expect(debounce.called).to.be.true;
    });

    it('should debounce with minimum delay of 100', () => {
      const debounce = stub(utils, 'debounce', (func, delay) =>
        expect(delay).to.eq(MIN_DELAY));
      tag()._config = { delay: 12 };

      tag().listenForInput(MOCK_QUERY);

      expect(debounce.called).to.be.true;
    });

    it('should attach click listener to document', () => {
      const addEventListener = stub(document, 'addEventListener');

      tag().listenForInput(MOCK_QUERY);

      expect(addEventListener.calledWith('click', tag().reset)).to.be.true;
    });
  });

  describe('debouncedSearch()', () => {
    it('should return a function', () => {
      expect(tag().debouncedSearch(<any>{ value: '' })).to.be.a('function');
    });

    it('should return a function that calls reset()', () => {
      const func = tag().debouncedSearch(<any>{ value: '' });
      const reset = stub(tag(), 'reset');
      tag()._config = { minimumCharacters: 3 };

      func();

      expect(reset.called).to.be.true;
    });

    it('should return a function that calls fetchSuggestions()', () => {
      const value = 'nike snea';
      const func = tag().debouncedSearch(<any>{ value });
      const fetchSuggestions = stub(tag(), 'fetchSuggestions');
      tag()._config = { minimumCharacters: 3 };

      func();

      expect(fetchSuggestions.calledWith(value)).to.be.true;
    });
  });
});
