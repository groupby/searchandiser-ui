import { Autocomplete } from '../../../src/tags/sayt/autocomplete';
import { Sayt } from '../../../src/tags/sayt/gb-sayt';
import * as utils from '../../../src/utils';
import { fluxTag } from '../../utils/tags';
import { expect } from 'chai';
import { Events, FluxCapacitor } from 'groupby-api';

describe('gb-sayt logic', () => {
  const structure = { title: 'title', price: 'price', image: 'image' };
  let tag: Sayt;
  let flux: FluxCapacitor;
  let sayt;
  let sandbox: Sinon.SinonSandbox;

  beforeEach(() => {
    sayt = { configure: () => null };
    ({ tag, flux } = fluxTag(new Sayt(), {
      config: { structure }
    }));
    Object.assign(tag, { sayt });
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => sandbox.restore());

  it('should have default values', () => {
    tag.init();

    expect(tag.saytConfig).to.eql({
      products: 4,
      queries: 5,
      autoSearch: true,
      staticSearch: false,
      highlight: true,
      navigationNames: {},
      allowedNavigations: []
    });
    expect(tag.categoryField).to.not.be.ok;
    expect(tag.struct).to.eql(structure);
    expect(tag.allCategoriesLabel).to.eq('All Departments');
    expect(tag.searchUrl).to.eq('/search');
    expect(tag.queryParam).to.eq('q');
    expect(tag.showProducts).to.be.true;
  });

  it('should take configuration overrides from global config', () => {
    const categoryField = 'category.value';
    const searchUrl = 'productSearch';
    const queryParam = 'query';
    const allCategoriesLabel = 'All Departments';
    const navigationNames = { brand: 'Brand' };
    const saytStructure = {
      image: 'thumbnail',
      url: 'url'
    };
    tag.config.tags = {
      sayt: {
        products: 0,
        queries: 10,
        categoryField,
        structure: saytStructure,
        autoSearch: false,
        staticSearch: true,
        highlight: false,
        allowedNavigations: ['brand'],
        navigationNames,
        searchUrl,
        queryParam,
        allCategoriesLabel
      }
    };
    tag.init();

    expect(tag.saytConfig).to.eql({
      products: 0,
      queries: 10,
      categoryField,
      structure: saytStructure,
      autoSearch: false,
      staticSearch: true,
      highlight: false,
      allowedNavigations: ['brand'],
      navigationNames,
      searchUrl,
      queryParam,
      allCategoriesLabel
    });
    expect(tag.categoryField).to.eq(categoryField);
    expect(tag.struct).to.eql(Object.assign({}, structure, saytStructure));
    expect(tag.allCategoriesLabel).to.eq(allCategoriesLabel);
    expect(tag.searchUrl).to.eq(searchUrl);
    expect(tag.queryParam).to.eq(queryParam);
    expect(tag.showProducts).to.be.false;
  });

  it('should configure sayt', () => {
    const generated = { a: 'b', c: 'd' };
    tag.generateSaytConfig = (): any => generated;
    sayt.configure = (config) => expect(config).to.eql(generated);

    tag.init();
  });

  it('should generate configuration', () => {
    const customerId = 'mycustomer';
    const collection = 'mycollection';
    const area = 'MyArea';
    tag.config = { customerId, collection, area };
    tag.init();

    const config = tag.generateSaytConfig();
    expect(config).to.eql({
      subdomain: customerId,
      collection,
      autocomplete: { numSearchTerms: 5 },
      productSearch: { area, numProducts: 4 }
    });
  });

  it('should initialise autocomplete on mount', () => {
    tag.init();
    tag.on = (event: string, cb: Function) => {
      expect(event).to.eq('mount');
      cb();
      expect(tag.autocomplete).to.be.instanceof(Autocomplete);
    };
  });

  it('should listen for events', () => {
    flux.on = (event: string, cb: Function): any => {
      switch (event) {
        case 'autocomplete':
          expect(cb).to.eq(tag.fetchSuggestions);
          break;
        case 'autocomplete:hide':
          expect(cb).to.eq(tag.reset);
          break;
        default: expect.fail();
      }
    };

    tag.init();
  });

  it('should reset autocomplete', () => {
    let autocompleteReset = false;
    tag.autocomplete = <any>{
      reset: () => autocompleteReset = true
    };
    tag.update = (data) => {
      expect(autocompleteReset).to.be.true;
      expect(data.queries).to.be.null;
      expect(data.navigations).to.be.null;
      expect(data.products).to.be.null;
    };

    tag.reset();
  });

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
    tag.update = (data) => expect(data.originalQuery).to.eq(originalQuery);
    tag.processResults = (res) => expect(res).to.eql(result);
    tag.searchProducts = () => expect.fail();

    tag.fetchSuggestions(originalQuery);
  });

  it('should fetch product suggestions', (done) => {
    const query = 'red sneakers';
    sayt.autocomplete = () => {
      return { then: (cb) => cb({ result: {} }) };
    };
    tag.showProducts = true;
    tag.queries = [{ value: query }];
    tag.processResults = () => null;
    tag.update = () => null;
    tag.searchProducts = (productQuery) => {
      expect(productQuery).to.eq(query);
      done();
    };

    tag.fetchSuggestions(undefined);
  });

  it('should search products', () => {
    const suggestion = 'red sneakers';
    const products = [{ a: 'b' }, { c: 'd' }];
    sayt.productSearch = (query) => {
      expect(query).to.eq(suggestion);
      return { then: (cb) => cb({ result: { products } }) };
    };
    tag.update = (data) => expect(data.products).to.eq(products);
    tag.showProducts = true;

    tag.searchProducts(suggestion);
  });

  it('should not search products', () => {
    sayt.productSearch = () => expect.fail();
    tag.showProducts = false;

    tag.searchProducts(undefined);
  });

  it('should emit query rewrite', () => {
    const newQuery = 'slippers';
    flux.emit = (event: string, query: string): any => {
      expect(event).to.eq(Events.REWRITE_QUERY);
      expect(query).to.eq(newQuery);
    };

    tag.rewriteQuery(newQuery);
  });

  it('should fetch suggestions and rewrite query', () => {
    const newQuery = 'cool shoes';
    tag.saytConfig = { autoSearch: true };
    tag.searchProducts = (query) => expect(query).to.eq(newQuery);
    tag.rewriteQuery = (query) => expect(query).to.eq(newQuery);

    tag.notifier(newQuery);
  });

  it('should fetch rewrite query but not fetch suggestions', () => {
    const newQuery = 'cool shoes';
    tag.saytConfig = { autoSearch: false };
    tag.searchProducts = () => expect.fail();
    tag.rewriteQuery = (query) => expect(query).to.eq(newQuery);

    tag.notifier(newQuery);
  });

  it('should refine', () => {
    const target = { a: 'b' };
    const mock = sandbox.stub(flux, 'resetRecall');
    tag.refine = (targetElement, query) => {
      expect(targetElement).to.eq(target);
      expect(query).to.eq('');
    };

    tag.searchRefinement(<any>{ target });
    expect(mock.called).to.be.true;
  });

  it('should refine with query', () => {
    const target = { a: 'b' };
    const mock = sandbox.stub(flux, 'resetRecall');
    tag.refine = (targetElement, query) => {
      expect(targetElement).to.eq(target);
      expect(query).to.eq('boots');
    };
    tag.originalQuery = 'boots';

    tag.searchCategory(<any>{ target });
    expect(mock.called).to.be.true;
  });

  it('should apply regex replacement with the current query', () => {
    tag.originalQuery = 'blue sneakers';
    tag.saytConfig = { highlight: true };

    const highlighted = tag.highlightCurrentQuery('hi-top blue sneakers', '<b>$&</b>');
    expect(highlighted).to.eq('hi-top <b>blue sneakers</b>');
  });

  it('should apply regex replacement with slashes', () => {
    tag.originalQuery = 'blue sneakers\\';
    tag.saytConfig = { highlight: true };

    const currentQuery = 'hi-top blue sneakers';
    const highlight = () => tag.highlightCurrentQuery(currentQuery, '<b>$&</b>');
    expect(highlight).to.not.throw();
    expect(highlight()).to.eq('hi-top blue sneakers');
  });

  it('should not apply regex replacement', () => {
    tag.originalQuery = 'blue sneakers';
    tag.saytConfig = { highlight: false };

    const highlighted = tag.highlightCurrentQuery('hi-top blue sneakers', '<b>$&</b>');
    expect(highlighted).to.eq('hi-top blue sneakers');
  });

  it('should insert category query into template', () => {
    tag.saytConfig = { categoryField: 'category.value' };

    const highlighted = tag.enhanceCategoryQuery({
      value: 'blue sneakers',
      category: 'Footwear'
    });
    expect(highlighted).to.eq('<b>blue sneakers</b> in <span class="gb-category-query">Footwear</span>');
  });

  it('should not enhance category suggestions', () => {
    tag.saytConfig = {};

    const highlighted = tag.enhanceCategoryQuery({
      value: 'blue sneakers',
      category: 'Footwear'
    });
    expect(highlighted).to.eq('blue sneakers');
    expect(highlighted).to.not.eq('Footwear');
  });

  it('should update results with suggestion as query', () => {
    const suggestion = 'red heels';
    tag.saytConfig = {};
    tag.rewriteQuery = (query) => expect(query).to.eq(suggestion);
    flux.reset = (query): any => expect(query).to.eq(suggestion);

    tag.search(<any>{
      target: {
        tagName: 'GB-SAYT-LINK',
        dataset: { value: suggestion }
      }
    });
  });

  it('should search for the gb-sayt-link node', () => {
    const suggestion = 'red heels';
    tag.saytConfig = {};
    tag.rewriteQuery = (query) => expect(query).to.eq(suggestion);
    flux.reset = (query): any => expect(query).to.eq(suggestion);

    tag.search(<any>{
      target: {
        parentElement: {
          parentElement: {
            tagName: 'GB-SAYT-LINK',
            dataset: { value: suggestion }
          }
        }
      }
    });
  });

  it('should perform a static search', () => {
    const suggestion = 'red heels';
    tag.rewriteQuery = () => expect.fail();
    sandbox.stub(utils, 'updateLocation', (searchUrl, queryParam, query, refinements) => {
      expect(searchUrl).to.eq('/search');
      expect(queryParam).to.eq('q');
      expect(query).to.eq(suggestion);
      expect(refinements).to.eql([]);
    });

    tag.init();
    tag.saytConfig.staticSearch = true;

    tag.search(<any>{
      target: {
        tagName: 'GB-SAYT-LINK',
        dataset: { value: suggestion }
      }
    });
  });

  describe('refine()', () => {
    it('should update results with suggestion and refinement', () => {
      const suggestion = 'red heels';
      const field = 'size';
      const refinement = 8;
      tag.saytConfig = {};
      tag.flux.rewrite = (query, config): any => {
        expect(query).to.eq(suggestion);
        expect(config.skipSearch).to.be.true;
      };
      flux.refine = (selectedRefinement): any => {
        expect(selectedRefinement).to.eql({
          navigationName: field,
          value: refinement,
          type: 'Value'
        });
      };

      tag.refine(<any>{
        tagName: 'GB-SAYT-LINK',
        dataset: { field, refinement }
      }, suggestion);
    });

    it('should skip refinement and do query', () => {
      const suggestion = 'red heels';
      const field = 'size';
      const refinement = 8;
      tag.saytConfig = {};
      flux.rewrite = (): any => expect.fail();
      flux.reset = (query): any => expect(query).to.eq(suggestion);

      tag.refine(<any>{
        tagName: 'GB-SAYT-LINK',
        dataset: { field, refinement, norefine: true }
      }, suggestion);
    });

    it('should perform a static refinement', () => {
      const suggestion = 'red heels';
      const field = 'size';
      const refinement = 8;
      tag.saytConfig = {};
      tag.flux.rewrite = (): any => expect.fail();
      sandbox.stub(utils, 'updateLocation', (searchUrl, queryParam, query, refinements) => {
        expect(searchUrl).to.eq('/search');
        expect(queryParam).to.eq('q');
        expect(query).to.eq(suggestion);
        expect(refinements).to.eql([{ navigationName: field, value: refinement, type: 'Value' }]);
      });

      tag.init();
      tag.saytConfig.staticSearch = true;

      tag.refine(<any>{
        tagName: 'GB-SAYT-LINK',
        dataset: { field, refinement }
      }, suggestion);
    });
  });

  describe('processResults()', () => {
    it('should update with defaults', () => {
      tag.update = ({ results, queries, navigations, categoryResults }) => {
        expect(results).to.eql({});
        expect(queries).to.be.undefined;
        expect(navigations).to.eql([]);
        expect(categoryResults).to.eql([]);
        expect(tag.matchesInput).to.not.be.ok;
      };

      tag.processResults({});
    });

    it('should extract and filter navigations', () => {
      const newNavigations = [{ name: 'brand' }, { name: 'colour' }];
      tag.saytConfig = { allowedNavigations: ['colour'], navigationNames: {} };
      tag.update = ({ navigations }) => expect(navigations).to.eql([{ name: 'colour', displayName: 'colour' }]);

      tag.processResults({ navigations: newNavigations });
    });

    it('should rename navigations', () => {
      const newNavigations = [{ name: 'colour' }];
      tag.saytConfig = { allowedNavigations: ['colour'], navigationNames: { colour: 'Colour' } };
      tag.update = ({ navigations }) => expect(navigations).to.eql([{ name: 'colour', displayName: 'Colour' }]);

      tag.processResults({ navigations: newNavigations });
    });

    it('should match input', () => {
      const query = 'red boots';
      const value = 'red boots';
      const additionalInfo = { a: 'b' };
      const categories = ['a', 'b'];
      const searchTerms = [{ value, additionalInfo }, { value: 'other' }];
      tag.extractCategoryResults = (categoryQuery) => {
        expect(categoryQuery.additionalInfo).to.eq(additionalInfo);
        return categories;
      };
      tag.originalQuery = query;
      tag.update = ({ categoryResults }) => expect(categoryResults).to.eq(categories);

      tag.processResults({ searchTerms });
      expect(tag.matchesInput).to.be.true;
      expect(searchTerms.length).to.eq(1);
    });

    it('should not match input', () => {
      const searchTerms = [{ value: 'red boots' }, { value: 'other' }];
      tag.originalQuery = 'blue socks';
      tag.update = ({ categoryResults }) => expect(categoryResults).to.eql([]);

      tag.processResults({ searchTerms });
      expect(tag.matchesInput).to.be.false;
      expect(searchTerms.length).to.eq(2);
    });

    it('should match case-insensitive input', () => {
      const query = 'Red Boots';
      const value = 'red boots';
      const additionalInfo = { a: 'b' };
      const categories = ['a', 'b'];
      const searchTerms = [{ value, additionalInfo }, { value: 'other' }];
      tag.extractCategoryResults = (categoryQuery) => {
        expect(categoryQuery.additionalInfo).to.eq(additionalInfo);
        return categories;
      };
      tag.originalQuery = query;
      tag.update = ({ categoryResults }) => expect(categoryResults).to.eq(categories);

      tag.processResults({ searchTerms });
      expect(tag.matchesInput).to.be.true;
      expect(searchTerms.length).to.eq(1);
    });
  });

  describe('extractCategoryResults()', () => {
    it('should return empty array if not configured', () => {
      expect(tag.extractCategoryResults({})).to.eql([]);
    });

    it('should extract categories for configured field', () => {
      tag.allCategoriesLabel = 'All Categories';
      tag.categoryField = 'department';
      tag.originalQuery = 'tool';
      const value = 'tool';
      const additionalInfo = { [tag.categoryField]: ['Power Tools', 'Patio Furniture', 'Camping'] };

      const categories = tag.extractCategoryResults({
        value,
        additionalInfo
      });
      expect(categories).to.eql([
        { category: tag.allCategoriesLabel, value: 'tool' },
        { category: 'Power Tools', value: 'tool' },
        { category: 'Patio Furniture', value: 'tool' },
        { category: 'Camping', value: 'tool' }
      ]);
    });
  });

  describe('static functions', () => {
    let tag;
    let flux;
    let searchBox;

    beforeEach(() => {
      flux = {};
      searchBox = {
        value: '',
        addEventListener: () => null
      };
      tag = {
        flux, searchBox,
        config: {
          tags: {
            sayt: {}
          }
        }
      };
    });

    it('should disable autocomplete for the searchBox', () => {
      Sayt.listenForInput(tag);

      expect(searchBox.autocomplete).to.eq('off');
    });

    it('should attach click listener to document', (done) => {
      flux.emit = (event) => expect(event).to.eq('autocomplete:hide');
      sandbox.stub(document, 'addEventListener', (event, cb) => {
        expect(event).to.eq('click');
        cb();
        done();
      });

      Sayt.listenForInput(tag);
    });

    it('should attach input listener to hide searchBox', (done) => {
      flux.emit = (event) => {
        expect(event).to.eq('autocomplete:hide');
        done();
      };
      searchBox.addEventListener = (event, cb) => {
        if (event === 'input') cb();
      };

      Sayt.listenForInput(tag);
    });

    it('should attach input listener to perform search', (done) => {
      searchBox.value = 'red leather';
      flux.emit = (event, query) => {
        expect(event).to.eq('autocomplete');
        expect(query).to.eq('red leather');
        done();
      };
      searchBox.addEventListener = (event, cb) => {
        if (event === 'input') cb();
      };

      Sayt.listenForInput(tag);
    });
  });
});
