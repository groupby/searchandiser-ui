import { Autocomplete, AUTOCOMPLETE_HIDE_EVENT } from '../../../src/tags/sayt/autocomplete';
import { META, MIN_DELAY, Sayt } from '../../../src/tags/sayt/gb-sayt';
import * as utils from '../../../src/utils/common';
import { refinement } from '../../utils/fixtures';
import suite from './_suite';
import { expect } from 'chai';
import { Events, Query } from 'groupby-api';

suite('gb-sayt', Sayt, ({
  flux, tag, spy, stub,
  expectSubscriptions,
  itShouldAlias,
  itShouldHaveMeta
}) => {
  itShouldHaveMeta(Sayt, META);

  describe('init()', () => {
    itShouldAlias(['sayt', 'productable']);

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

  describe('setDefaults()', () => {
    it('should set defaults', () => {
      const collection = 'a';
      const area = 'b';
      const language = 'c';
      const structure = 'd';
      tag().config = <any>{ collection, area, language, structure };
      tag().sayt = { configure: () => null };

      tag().setDefaults({});

      expect(tag().collection).to.eq(collection);
      expect(tag().area).to.eq(area);
      expect(tag().language).to.eq(language);
      expect(tag().structure).to.eq(structure);
    });

    it('should override defaults from computed config', () => {
      const collection = 'a';
      const area = 'b';
      const language = 'c';
      const structure = 'd';
      tag().sayt = { configure: () => null };

      tag().setDefaults({ collection, area, language, structure });

      expect(tag().collection).to.eq(collection);
    });

    it('should set showProducts true if productCount is not 0', () => {
      tag().productCount = 3;
      tag().sayt = { configure: () => null };

      tag().setDefaults({});

      expect(tag().showProducts).to.be.true;
    });

    it('should set showProducts false if productCount is 0', () => {
      tag().productCount = 0;
      tag().sayt = { configure: () => null };

      tag().setDefaults({});

      expect(tag().showProducts).to.be.false;
    });

    it('should call sayt.configure()', () => {
      const saytConfig = { a: 'b' };
      const configure = spy();
      const generateSaytConfig = tag().generateSaytConfig = spy(() => saytConfig);
      tag().sayt = { configure };

      tag().setDefaults({});

      expect(generateSaytConfig).to.be.called;
      expect(configure).to.be.calledWith(saytConfig);
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
      const collection = tag().collection = 'mycollection';
      const area = tag().area = 'MyArea';
      const language = tag().language = 'en';
      tag().config = <any>{ customerId };
      tag().queryCount = 2;
      tag().productCount = 3;
      tag().https = true;

      const config = tag().generateSaytConfig();

      expect(config).to.eql({
        subdomain: customerId,
        collection,
        autocomplete: { language, numSearchTerms: 2 },
        productSearch: { area, language, numProducts: 3 },
        https: true
      });
    });

    it('should generate configuration with HTTPS', () => {
      tag().https = true;

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
      expect(update).to.be.calledWith({
        queries: null,
        navigations: null,
        products: null
      });
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

      expect(processResults).to.be.calledWith(result);
      expect(update).to.be.calledWith({ originalQuery });
    });

    it('should call searchProducts()', (done) => {
      const query = 'red sneakers';
      const processResults = stub(tag(), 'processResults');
      const update = tag().update = spy();
      tag().showProducts = true;
      tag().queries = [{ value: query }];
      tag().searchProducts = (productQuery) => {
        expect(processResults).to.be.called;
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
        expect(productSearch).to.be.calledWith(suggestion, { refinements: undefined });
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

      expect(emit).to.be.calledWith(Events.REWRITE_QUERY, query);
    });
  });

  describe('notifier()', () => {
    it('should fetch suggestions and rewrite query', () => {
      const query = 'cool shoes';
      const searchProducts = stub(tag(), 'searchProducts');
      const rewriteQuery = stub(tag(), 'rewriteQuery');
      tag().autoSearch = true;

      tag().notifier(query);

      expect(searchProducts).to.be.calledWith(query, undefined);
      expect(rewriteQuery).to.be.calledWith(query);
    });

    it('should fetch suggestions with refinements', () => {
      const query = 'cool shoes';
      const searchProducts = stub(tag(), 'searchProducts');
      tag().rewriteQuery = () => null;
      tag().autoSearch = true;
      tag().categoryField = 'size';

      tag().notifier(query, 'Medium');

      expect(searchProducts).to.be.calledWith(query, '~size=Medium');
    });

    it('should fetch suggestions with refinements and overwite query', () => {
      const searchProducts = stub(tag(), 'searchProducts');
      tag().rewriteQuery = () => null;
      tag().autoSearch = true;
      tag().categoryField = 'size';

      tag().notifier('Color: Blue', 'Blue', 'color');

      expect(searchProducts).to.be.calledWith('', '~color=Blue');
    });

    it('should fetch rewrite query but not fetch suggestions', () => {
      const query = 'cool shoes';
      const rewriteQuery = stub(tag(), 'rewriteQuery');
      tag().autoSearch = false;
      tag().searchProducts = () => expect.fail();

      tag().notifier(query);

      expect(rewriteQuery).to.be.calledWith(query);
    });
  });

  describe('searchRefinement()', () => {
    it('should refine', () => {
      const target = { a: 'b' };
      const resetRecall = stub(flux(), 'resetRecall');
      const refine = stub(tag(), 'refine');

      tag().searchRefinement(<any>{ target });

      expect(resetRecall.called).to.be.true;
      expect(refine).to.be.calledWith(target, '');
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
      expect(refine).to.be.calledWith(target, 'boots');
    });
  });

  describe('highlightCurrentQuery()', () => {
    it('should apply regex replacement with the current query', () => {
      tag().originalQuery = 'blue sneakers';
      tag().highlight = true;

      const highlighted = tag().highlightCurrentQuery('hi-top blue sneakers', '<b>$&</b>');

      expect(highlighted).to.eq('hi-top <b>blue sneakers</b>');
    });

    it('should apply regex replacement with slashes', () => {
      const currentQuery = 'hi-top blue sneakers';
      tag().originalQuery = 'blue sneakers\\';
      tag().highlight = true;

      const highlight = () => tag().highlightCurrentQuery(currentQuery, '<b>$&</b>');

      expect(highlight).to.not.throw();
      expect(highlight()).to.eq('hi-top blue sneakers');
    });

    it('should not apply regex replacement', () => {
      tag().originalQuery = 'blue sneakers';
      tag().highlight = false;

      const highlighted = tag().highlightCurrentQuery('hi-top blue sneakers', '<b>$&</b>');

      expect(highlighted).to.eq('hi-top blue sneakers');
    });
  });

  describe('enhanceCategoryQuery()', () => {
    it('should insert category query into template', () => {
      tag().categoryField = 'category.value';

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
      const reset = stub(flux(), 'reset').resolves();
      const emitEvent = stub(tag(), 'emitEvent');

      tag().search(<any>{
        target: {
          tagName: 'GB-SAYT-LINK',
          dataset: { value: suggestion }
        }
      })
        .then(() => {
          expect(rewriteQuery).to.be.calledWith(suggestion);
          expect(reset).to.be.calledWith(suggestion);
          expect(emitEvent).to.be.called;
          done();
        });
    });

    it('should search for the gb-sayt-link node', (done) => {
      const suggestion = 'red heels';
      const rewriteQuery = stub(tag(), 'rewriteQuery');
      const reset = stub(flux(), 'reset').resolves();
      tag().emitEvent = () => null;

      tag().search(<any>{
        target: {
          parentElement: {
            parentElement: {
              tagName: 'GB-SAYT-LINK',
              dataset: { value: suggestion }
            }
          }
        }
      })
        .then(() => {
          expect(rewriteQuery).to.be.calledWith(suggestion);
          expect(reset).to.be.calledWith(suggestion);
          done();
        });
    });

    it('should perform a static search', (done) => {
      const suggestion = 'red heels';
      const update = spy();
      flux().query = new Query('black heels')
        .withSelectedRefinements({ navigationName: 'brand', type: 'Value', value: '' })
        .skip(19);
      tag().rewriteQuery = () => expect.fail();
      tag().services = <any>{ url: { isActive: () => true, update } };
      tag().staticSearch = true;

      tag().search(<any>{
        target: {
          tagName: 'GB-SAYT-LINK',
          dataset: { value: suggestion }
        }
      })
        .then(() => {
          expect(update).to.be.calledWith(sinon.match.instanceOf(Query));
          expect(update).to.be.calledWithMatch({
            raw: {
              query: suggestion,
              refinements: [],
              skip: 19
            }
          });
          done();
        });
    });
  });

  describe('refine()', () => {
    it('should update results with suggestion and refinement', (done) => {
      const suggestion = 'red heels';
      const field = 'size';
      const value = 'medium';
      const rewrite = stub(flux(), 'rewrite');
      const refine = stub(flux(), 'refine').resolves();
      const emitEvent = stub(tag(), 'emitEvent');

      tag().refine(<any>{
        tagName: 'GB-SAYT-LINK',
        dataset: { field, refinement: value }
      }, suggestion)
        .then(() => {
          expect(rewrite).to.be.calledWith(suggestion, { skipSearch: true });
          expect(refine).to.be.calledWith(refinement(field, value));
          expect(emitEvent).to.be.called;
          done();
        });
    });

    it('should skip refinement and do query', (done) => {
      const suggestion = 'red heels';
      const field = 'size';
      const refinement = 8;
      const reset = stub(flux(), 'reset').resolves();
      flux().rewrite = (): any => expect.fail();
      tag().emitEvent = () => null;

      tag().refine(<any>{
        tagName: 'GB-SAYT-LINK',
        dataset: { field, refinement, norefine: true }
      }, suggestion)
        .then(() => {
          expect(reset).to.be.calledWith(suggestion);
          done();
        });
    });

    it('should perform a static refinement', (done) => {
      const suggestion = 'red heels';
      const field = 'size';
      const value = 8;
      const update = spy();
      flux().query = new Query('blue heels').skip(13);
      flux().rewrite = (): any => expect.fail();
      tag().services = <any>{ url: { update, isActive: () => true } };
      tag().staticSearch = true;

      tag().refine(<any>{
        tagName: 'GB-SAYT-LINK',
        dataset: { field, refinement: value }
      }, suggestion)
        .then(() => {
          expect(update).to.be.calledWith(sinon.match.instanceOf(Query));
          expect(update).to.be.calledWithMatch({
            raw: {
              query: suggestion,
              refinements: [refinement(field, value)],
              skip: 13
            }
          });
          done();
        });
    });

    it('should perform a static refinement with only query', (done) => {
      const suggestion = 'red heels';
      const update = spy();
      tag().services = <any>{ url: { update, isActive: () => true } };
      tag().staticSearch = true;

      tag().refine(<any>{
        tagName: 'GB-SAYT-LINK',
        dataset: { norefine: true }
      }, suggestion)
        .then(() => {
          expect(update).to.be.calledWithMatch({
            raw: {
              query: suggestion,
              refinements: []
            }
          });
          done();
        });
    });

    it('should perform refinement using configured category field', (done) => {
      const field = 'size';
      const value = 'medium';
      flux().refine = (ref): any => {
        expect(ref).to.eql(refinement(field, value));
        done();
      };
      tag().categoryField = field;

      tag().refine(<any>{
        tagName: 'GB-SAYT-LINK',
        dataset: { refinement: value }
      }, 'red heels');
    });

    it('should perform static refinement using configured category field', (done) => {
      const suggestion = 'red heels';
      const value = 8;
      const update = spy();
      const field = tag().categoryField = 'size';
      flux().query = new Query('black heels').skip(30);
      tag().services = <any>{ url: { update, isActive: () => true } };
      tag().staticSearch = true;

      tag().refine(<any>{
        tagName: 'GB-SAYT-LINK',
        dataset: { refinement: value }
      }, suggestion)
        .then(() => {
          expect(update).to.be.calledWith(sinon.match.instanceOf(Query));
          expect(update).to.be.calledWithMatch({
            raw: {
              query: suggestion,
              refinements: [refinement(field, value)],
              skip: 30
            }
          });
          done();
        });
    });
  });

  describe('processResults()', () => {
    it('should update with defaults', () => {
      const update = tag().update = spy();

      tag().processResults({});

      expect(update).to.be.calledWith({
        results: {},
        queries: undefined,
        navigations: [],
        categoryResults: []
      });
      expect(tag().matchesInput).to.not.be.ok;
    });

    it('should extract and filter navigations', () => {
      const newNavigations = [{ name: 'brand' }, { name: 'colour' }];
      const update = tag().update = spy();
      tag().allowedNavigations = ['colour'];
      tag().navigationNames = {};

      tag().processResults({ navigations: newNavigations });

      expect(update).to.be.calledWithMatch({
        navigations: [{ name: 'colour', displayName: 'colour' }]
      });
    });

    it('should rename navigations', () => {
      const newNavigations = [{ name: 'colour' }];
      const update = tag().update = spy();
      tag().allowedNavigations = ['colour'];
      tag().navigationNames = { colour: 'Colour' };

      tag().processResults({ navigations: newNavigations });

      expect(update).to.be.calledWithMatch({
        navigations: [{ name: 'colour', displayName: 'Colour' }]
      });
    });

    it('should match input', () => {
      const value = tag().originalQuery = 'red boots';
      const additionalInfo = { a: 'b' };
      const categoryResults = ['a', 'b'];
      const searchTerms = [{ value, additionalInfo }, { value: 'other' }];
      const update = tag().update = spy();
      const extractCategoryResults = tag().extractCategoryResults = spy(() => categoryResults);

      tag().processResults({ searchTerms });

      expect(tag().matchesInput).to.be.true;
      expect(searchTerms.length).to.eq(1);
      expect(update).to.be.calledWithMatch({ categoryResults });
      expect(extractCategoryResults).to.be.calledWithMatch({ additionalInfo, value });
    });

    it('should not match input', () => {
      const searchTerms = [{ value: 'red boots' }, { value: 'other' }];
      const update = tag().update = spy();
      tag().originalQuery = 'blue socks';

      tag().processResults({ searchTerms });

      expect(tag().matchesInput).to.be.false;
      expect(searchTerms.length).to.eq(2);
      expect(update).to.be.calledWithMatch({ categoryResults: [] });
    });

    it('should match case-insensitive input', () => {
      const value = 'red boots';
      const additionalInfo = { a: 'b' };
      const searchTerms = [{ value, additionalInfo }, { value: 'other' }];
      const categoryResults: any = { c: 'd' };
      const update = tag().update = spy();
      tag().originalQuery = 'Red Boots';
      tag().extractCategoryResults = () => categoryResults;

      tag().processResults({ searchTerms });

      expect(tag().matchesInput).to.be.true;
      expect(update).to.be.calledWithMatch({ categoryResults });
    });
  });

  describe('extractCategoryResults()', () => {
    it('should return empty array if not configured', () => {
      expect(tag().extractCategoryResults({})).to.eql([]);
    });

    it('should extract categories for configured field', () => {
      const allCategoriesLabel = tag().allCategoriesLabel = 'All Categories';
      const categoryField = tag().categoryField = 'department';
      const query = tag().originalQuery = 'tool';

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
      const debounce = stub(utils, 'debounce', () => debouncedSearchFunc);
      const debouncedSearch = stub(tag(), 'debouncedSearch', () => searchFunc);

      tag().listenForInput(queryTag);

      expect(searchBox.autocomplete).to.eq('off');
      expect(addEventListener).to.be.calledWith('input', debouncedSearchFunc);
      expect(debounce).to.be.calledWith(searchFunc);
      expect(debouncedSearch).to.be.calledWith(searchBox);
    });

    it('should debounce with the configured delay', () => {
      const saytDelay = 1423;
      const debounce = stub(utils, 'debounce');
      tag().delay = saytDelay;

      tag().listenForInput(MOCK_QUERY);

      expect(debounce).to.be.calledWith(sinon.match.func, saytDelay);
    });

    it('should debounce with minimum delay of 100', () => {
      const debounce = stub(utils, 'debounce');
      tag().delay = 12;

      tag().listenForInput(MOCK_QUERY);

      expect(debounce).to.be.calledWith(sinon.match.func, MIN_DELAY);
    });

    it('should attach click listener to document', () => {
      const addEventListener = stub(document, 'addEventListener');

      tag().listenForInput(MOCK_QUERY);

      expect(addEventListener).to.be.calledWith('click', tag().reset);
    });
  });

  describe('debouncedSearch()', () => {
    it('should return a function', () => {
      expect(tag().debouncedSearch(<any>{ value: '' })).to.be.a('function');
    });

    it('should return a function that calls reset()', () => {
      const func = tag().debouncedSearch(<any>{ value: '' });
      const reset = stub(tag(), 'reset');
      tag().minimumCharacters = 3;

      func();

      expect(reset).to.be.called;
    });

    it('should return a function that calls fetchSuggestions()', () => {
      const value = 'nike snea';
      const func = tag().debouncedSearch(<any>{ value });
      const fetchSuggestions = stub(tag(), 'fetchSuggestions');
      tag().minimumCharacters = 3;

      func();

      expect(fetchSuggestions).to.be.calledWith(value);
    });
  });

  describe('emitEvent()', () => {
    it('should call tracker.sayt()', (done) => {
      tag().services = <any>{
        tracker: {
          sayt: () => done()
        }
      };

      tag().emitEvent();
    });

    it('should check for the tracker service', () => {
      tag().services = <any>{};

      tag().emitEvent();
    });
  });
});
