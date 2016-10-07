import { Autocomplete, AUTOCOMPLETE_HIDE_EVENT } from '../../../src/tags/sayt/autocomplete';
import { DEFAULT_CONFIG, Sayt } from '../../../src/tags/sayt/gb-sayt';
import * as utils from '../../../src/utils/common';
import suite, { fluxTag } from './_suite';
import { expect } from 'chai';
import { Events, FluxCapacitor } from 'groupby-api';

const STRUCTURE = {
  title: 'title',
  price: 'price',
  image: 'image'
};

suite('gb-sayt', Sayt, { config: { structure: STRUCTURE } }, ({
  flux, tag, sandbox,
  expectSubscriptions,
  itShouldConfigure
}) => {
  let sayt;

  beforeEach(() => tag().sayt = sayt = { configure: () => null });

  describe('init()', () => {
    itShouldConfigure(DEFAULT_CONFIG);

    it('should have default values', () => {
      tag().init();

      expect(tag().struct).to.eql(STRUCTURE);
      expect(tag().showProducts).to.be.true;
    });

    it('should take configuration overrides from global config', () => {
      const saytStructure = { image: 'thumbnail', url: 'url' };
      tag().configure = () => tag()._config = {
        products: 0,
        structure: saytStructure
      };

      tag().init();

      expect(tag().struct).to.eql(Object.assign({}, STRUCTURE, saytStructure));
      expect(tag().showProducts).to.be.false;
    });

    it('should configure sayt', () => {
      const generated = { a: 'b', c: 'd' };
      tag().generateSaytConfig = (): any => generated;
      const spy = sayt.configure = sinon.spy((config) => expect(config).to.eql(generated));

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

      // TODO: get rid of this
      tag().init();

      const config = tag().generateSaytConfig();

      expect(config).to.eql({
        subdomain: customerId,
        collection,
        autocomplete: { numSearchTerms: 5 },
        productSearch: { area, numProducts: 4 },
        https: false
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
      let autocompleteReset = false;
      tag().autocomplete = <any>{
        reset: () => autocompleteReset = true
      };
      const spy = tag().update = sinon.spy((data) => {
        expect(autocompleteReset).to.be.true;
        expect(data.queries).to.be.null;
        expect(data.navigations).to.be.null;
        expect(data.products).to.be.null;
      });

      tag().reset();

      expect(spy.called).to.be.true;
    });
  });

  describe('fetchSuggestions()', () => {
    it('should fetch suggestions not products', (done) => {
      const originalQuery = 'red sneakers';
      const result = { a: 'b', c: 'd' };
      sayt.autocomplete = (query) => {
        expect(query).to.eq(originalQuery);
        return {
          then: (cb) => {
            cb({ result });
            done();
          }
        };
      };
      tag().update = (data) => expect(data.originalQuery).to.eq(originalQuery);
      const spy = tag().processResults = sinon.spy((res) => expect(res).to.eql(result));
      tag().searchProducts = () => expect.fail();

      tag().fetchSuggestions(originalQuery);

      expect(spy.called).to.be.true;
    });

    it('should fetch product suggestions', (done) => {
      const query = 'red sneakers';
      sayt.autocomplete = () => {
        return { then: (cb) => cb({ result: {} }) };
      };
      tag().showProducts = true;
      tag().queries = [{ value: query }];
      tag().processResults = () => null;
      tag().update = () => null;
      tag().searchProducts = (productQuery) => {
        expect(productQuery).to.eq(query);
        done();
      };

      tag().fetchSuggestions(undefined);
    });
  });

  describe('searchProducts()', () => {
    it('should search products', () => {
      const suggestion = 'red sneakers';
      const products = [{ a: 'b' }, { c: 'd' }];
      sayt.productSearch = (query) => {
        expect(query).to.eq(suggestion);
        return { then: (cb) => cb({ result: { products } }) };
      };
      const spy = tag().update = sinon.spy((data) => expect(data.products).to.eq(products));
      tag().showProducts = true;

      tag().searchProducts(suggestion);

      expect(spy.called).to.be.true;
    });

    it('should not search products', () => {
      sayt.productSearch = () => expect.fail();
      tag().showProducts = false;

      tag().searchProducts(undefined);
    });
  });

  describe('rewriteQuery()', () => {
    it('should emit rewrite_query', () => {
      const newQuery = 'slippers';
      flux().query.withQuery(newQuery);
      const spy = flux().emit = sinon.spy((event: string, query: string): any => {
        expect(event).to.eq(Events.REWRITE_QUERY);
        expect(query).to.eq(newQuery);
      });

      tag().rewriteQuery(newQuery);

      expect(spy.called).to.be.true;
    });
  });

  describe('notifier()', () => {
    it('should fetch suggestions and rewrite query', () => {
      const newQuery = 'cool shoes';
      tag()._config = { autoSearch: true };
      const searchSpy = tag().searchProducts = sinon.spy((query) => expect(query).to.eq(newQuery));
      const rewriteSpy = tag().rewriteQuery = sinon.spy((query) => expect(query).to.eq(newQuery));

      tag().notifier(newQuery);

      expect(searchSpy.called).to.be.true;
      expect(rewriteSpy.called).to.be.true;
    });

    it('should fetch rewrite query but not fetch suggestions', () => {
      const newQuery = 'cool shoes';
      tag()._config = { autoSearch: false };
      tag().searchProducts = () => expect.fail();
      const spy = tag().rewriteQuery = sinon.spy((query) => expect(query).to.eq(newQuery));

      tag().notifier(newQuery);

      expect(spy.called).to.be.true;
    });
  });

  describe('searchRefinement()', () => {
    it('should refine', () => {
      const target = { a: 'b' };
      const spy = flux().resetRecall = sinon.spy();
      tag().refine = (targetElement, query) => {
        expect(targetElement).to.eq(target);
        expect(query).to.eq('');
      };

      tag().searchRefinement(<any>{ target });

      expect(spy.called).to.be.true;
    });
  });

  describe('searchCategory()', () => {
    it('should refine with query', () => {
      const target = { a: 'b' };
      const spy = flux().resetRecall = sinon.spy();
      tag().refine = (targetElement, query) => {
        expect(targetElement).to.eq(target);
        expect(query).to.eq('boots');
      };
      tag().originalQuery = 'boots';

      tag().searchCategory(<any>{ target });

      expect(spy.called).to.be.true;
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
      tag().rewriteQuery = (query) => expect(query).to.eq(suggestion);
      const spy = flux().reset = sinon.spy((query): any => expect(query).to.eq(suggestion));

      tag().search(<any>{
        target: {
          tagName: 'GB-SAYT-LINK',
          dataset: { value: suggestion }
        }
      });

      expect(spy.called).to.be.true;
    });

    it('should search for the gb-sayt-link node', () => {
      const suggestion = 'red heels';
      tag()._config = {};
      tag().rewriteQuery = (query) => expect(query).to.eq(suggestion);
      const spy = flux().reset = sinon.spy((query): any => expect(query).to.eq(suggestion));

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

      expect(spy.called).to.be.true;
    });
  });

  describe('refine()', () => {
    it('should update results with suggestion and refinement', () => {
      const suggestion = 'red heels';
      const field = 'size';
      const refinement = 8;
      tag()._config = {};
      tag().flux.rewrite = (query, config): any => {
        expect(query).to.eq(suggestion);
        expect(config.skipSearch).to.be.true;
      };
      const spy = flux().refine = sinon.spy((selectedRefinement): any => {
        expect(selectedRefinement).to.eql({
          navigationName: field,
          value: refinement,
          type: 'Value'
        });
      });

      tag().refine(<any>{
        tagName: 'GB-SAYT-LINK',
        dataset: { field, refinement }
      }, suggestion);

      expect(spy.called).to.be.true;
    });

    it('should skip refinement and do query', () => {
      const suggestion = 'red heels';
      const field = 'size';
      const refinement = 8;
      tag()._config = {};
      flux().rewrite = (): any => expect.fail();
      const spy = flux().reset = sinon.spy((query): any => expect(query).to.eq(suggestion));

      tag().refine(<any>{
        tagName: 'GB-SAYT-LINK',
        dataset: { field, refinement, norefine: true }
      }, suggestion);

      expect(spy.called).to.be.true;
    });
  });

  describe('processResults()', () => {
    it.only('should update with defaults', () => {
      // TODO: add spy and check for called
      tag().update = ({ results, queries, navigations, categoryResults }) => {
        expect(results).to.eql({});
        expect(queries).to.be.undefined;
        expect(navigations).to.eql([]);
        expect(categoryResults).to.eql([]);
        expect(tag().matchesInput).to.not.be.ok;
      };

      tag().processResults({});
    });

    it('should extract and filter navigations', () => {
      const newNavigations = [{ name: 'brand' }, { name: 'colour' }];
      tag()._config = { allowedNavigations: ['colour'], navigationNames: {} };
      tag().update = ({ navigations }) => expect(navigations).to.eql([{ name: 'colour', displayName: 'colour' }]);

      tag().processResults({ navigations: newNavigations });
    });

    it('should rename navigations', () => {
      const newNavigations = [{ name: 'colour' }];
      tag()._config = { allowedNavigations: ['colour'], navigationNames: { colour: 'Colour' } };
      tag().update = ({ navigations }) => expect(navigations).to.eql([{ name: 'colour', displayName: 'Colour' }]);

      tag().processResults({ navigations: newNavigations });
    });

    it('should match input', () => {
      const query = 'red boots';
      const value = 'red boots';
      const additionalInfo = { a: 'b' };
      const categories = ['a', 'b'];
      const searchTerms = [{ value, additionalInfo }, { value: 'other' }];
      tag().extractCategoryResults = (categoryQuery) => {
        expect(categoryQuery.additionalInfo).to.eq(additionalInfo);
        expect(categoryQuery.value).to.eq(value);
        return categories;
      };
      tag().originalQuery = query;
      tag().update = ({ categoryResults }) => expect(categoryResults).to.eq(categories);

      tag().processResults({ searchTerms });
      expect(tag().matchesInput).to.be.true;
      expect(searchTerms.length).to.eq(1);
    });

    it('should not match input', () => {
      const searchTerms = [{ value: 'red boots' }, { value: 'other' }];
      tag().originalQuery = 'blue socks';
      tag().update = ({ categoryResults }) => expect(categoryResults).to.eql([]);

      tag().processResults({ searchTerms });
      expect(tag().matchesInput).to.be.false;
      expect(searchTerms.length).to.eq(2);
    });

    it('should match case-insensitive input', (done) => {
      const query = 'Red Boots';
      const value = 'red boots';
      const additionalInfo = { a: 'b' };
      const searchTerms = [{ value, additionalInfo }, { value: 'other' }];
      tag().originalQuery = query;
      tag().extractCategoryResults = () => done();

      tag().processResults({ searchTerms });
      expect(tag().matchesInput).to.be.true;
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
      tag()._config = { allCategoriesLabel, categoryField };
      tag().originalQuery = 'tool';
      const categories = tag().extractCategoryResults({
        value: 'tool',
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
});

describe('gb-sayt logic', () => {
  let tag: Sayt;
  let flux: FluxCapacitor;
  let sayt;
  let sandbox: Sinon.SinonSandbox;

  beforeEach(() => {
    sayt = { configure: () => null };
    ({ tag, flux } = fluxTag(new Sayt(), { config: { STRUCTURE }, sayt }));
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => sandbox.restore());

  it('should perform a static search', () => {
    const suggestion = 'red heels';
    tag.rewriteQuery = () => expect.fail();
    tag.services = <any>{
      url: {
        active: () => true,
        update: (query, refinements) => {
          expect(query).to.eq(suggestion);
          expect(refinements).to.eql([]);
        }
      }
    };

    tag.init();
    tag._config = { staticSearch: true };

    tag.search(<any>{
      target: {
        tagName: 'GB-SAYT-LINK',
        dataset: { value: suggestion }
      }
    });
  });

  describe('refine()', () => {
    it('should perform a static refinement', () => {
      const suggestion = 'red heels';
      const field = 'size';
      const refinement = 8;
      tag.services = <any>{
        url: {
          active: () => true,
          update: (query, refinements) => {
            expect(query).to.eq(suggestion);
            expect(refinements).to.eql([{ navigationName: field, value: refinement, type: 'Value' }]);
          }
        }
      };
      tag._config = {};
      tag.flux.rewrite = (): any => expect.fail();

      tag.init();
      tag._config.staticSearch = true;

      tag.refine(<any>{
        tagName: 'GB-SAYT-LINK',
        dataset: { field, refinement }
      }, suggestion);
    });
  });

  describe('listenForInput()', () => {
    let queryTag;
    let searchBox;

    beforeEach(() => {
      searchBox = {
        value: '',
        addEventListener: () => null
      };
      queryTag = {
        flux, searchBox,
        config: {
          tags: {
            sayt: {}
          }
        }
      };
    });

    it('should disable autocomplete for the searchBox', () => {
      tag.init();
      tag.listenForInput(queryTag);
      expect(searchBox.autocomplete).to.eq('off');
    });

    it('should attach click listener to document', (done) => {
      const mock = sandbox.stub(tag, 'reset');
      sandbox.stub(document, 'addEventListener', (event, cb) => {
        expect(event).to.eq('click');
        cb();
        expect(mock.called).to.be.true;
        done();
      });

      tag.init();
      tag.listenForInput(queryTag);
    });

    it('should attach input listener to hide searchBox', (done) => {
      tag.reset = () => done();
      searchBox.addEventListener = (event, cb) => {
        if (event === 'input') cb();
      };

      tag.init();
      tag.listenForInput(queryTag);
    });

    it('should attach input listener to perform search', (done) => {
      searchBox.value = 'red leather';
      tag.sayt.autocomplete = (query) => {
        expect(query).to.eq(searchBox.value);
        return {
          then: (cb) => cb({})
        };
      };
      searchBox.addEventListener = (event, cb) => {
        if (event === 'input') cb();
      };

      tag.processResults = () => done();
      tag.update = () => null;
      tag.init();
      tag.listenForInput(queryTag);
    });

    it('should have a delay >= 100 miliseconds', (done) => {
      tag._config = { delay: 10 };
      sandbox.stub(utils, 'debounce', (callback, delay) => {
        expect(delay).to.eq(100);
        done();
      });
      tag.listenForInput(queryTag);
    });
  });
});
