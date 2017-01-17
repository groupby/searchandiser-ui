import { debounce } from '../../utils/common';
import { ProductStructure } from '../../utils/product-transformer';
import { Query } from '../query/gb-query';
import { SaytTag, TagConfigure } from '../tag';
import { Autocomplete, AUTOCOMPLETE_HIDE_EVENT } from './autocomplete';
import { Events, Navigation, Record, SelectedValueRefinement } from 'groupby-api';
import escapeStringRegexp = require('escape-string-regexp');

export interface SaytConfig {
  structure?: ProductStructure;
  categoryField?: string;
  allCategoriesLabel?: string;
  collection?: string;
  area?: string;
  language?: string;
  productCount?: number;
  queryCount?: number;
  minimumCharacters?: number;
  delay?: number;
  autoSearch?: boolean;
  staticSearch?: boolean;
  https?: boolean;
  highlight?: boolean;
  navigationNames?: { [name: string]: string };
  allowedNavigations?: string[];
}

export const MIN_DELAY = 100;
export const DEFAULTS = {
  allCategoriesLabel: 'All Departments',
  highlight: true,
  autoSearch: true,
  delay: 100,
  minimumCharacters: 1,
  navigationNames: {},
  allowedNavigations: [],
  productCount: 4,
  queryCount: 5
};
export const TYPES = {
  highlight: 'boolean',
  autoSearch: 'boolean',
  staticSearch: 'boolean',
  https: 'boolean'
};

export class Sayt extends SaytTag<any> {
  structure: ProductStructure;
  navigationNames: { [key: string]: string };
  allowedNavigations: string[];
  allCategoriesLabel: string;
  categoryField: string;
  area: string;
  collection: string;
  language: string;
  delay: number;
  productCount: number;
  queryCount: number;
  minimumCharacters: number;
  highlight: boolean;
  https: boolean;
  autoSearch: boolean;
  staticSearch: boolean;

  autocomplete: Autocomplete;
  products: Record[];
  navigations: Navigation[];
  queries: any[];
  categoryResults: any[];
  results: any;
  autocompleteList: HTMLUListElement;
  originalQuery: string;
  showProducts: boolean;
  matchesInput: boolean;

  init() {
    this.alias(['sayt', 'productable']);

    this.on('mount', this.initializeAutocomplete);
    this.flux.on(AUTOCOMPLETE_HIDE_EVENT, this.reset);
  }

  onConfigure(configure: TagConfigure) {
    const config = configure({ defaults: DEFAULTS, types: TYPES });

    this.structure = config.structure || this.config.structure;
    this.collection = config.collection || this.config.collection;
    this.language = config.language || this.config.language;
    this.area = config.area || this.config.area;
    this.showProducts = this.productCount > 0;

    this.sayt.configure(this.generateSaytConfig());
  }

  initializeAutocomplete() {
    this.autocomplete = new Autocomplete(this);
  }

  generateSaytConfig() {
    return {
      subdomain: this.config.customerId,
      collection: this.collection,
      autocomplete: {
        numSearchTerms: this.queryCount,
        language: this.language
      },
      productSearch: {
        area: this.area,
        numProducts: this.productCount,
        language: this.language
      },
      https: this.https
    };
  }

  reset() {
    this.autocomplete.reset();
    this.update({ queries: null, navigations: null, products: null });
  }

  fetchSuggestions(originalQuery: string) {
    this.sayt.autocomplete(originalQuery)
      .then(({ result }) => ({ result, originalQuery }))
      .then(this.handleSuggestions)
      .catch((err) => console.error(err));
  }

  handleSuggestions({ result, originalQuery }: { result: any, originalQuery: string }) {
    this.update({ originalQuery });
    this.processResults(result);
    if (this.queries && this.showProducts) {
      const query = this.matchesInput ? originalQuery : this.queries[0].value;
      this.searchProducts(query);
    }
  }

  searchProducts(query: string = '', refinements?: string) {
    if (this.showProducts) {
      this.sayt.productSearch(query, { refinements })
        .then((res) => this.update({ products: res.result.products }));
    }
  }

  rewriteQuery(query: string) {
    this.flux.emit(Events.REWRITE_QUERY, query);
  }

  notifier(query: string, refinement?: string, field?: string) {
    const isRefinement = refinement && refinement !== this.allCategoriesLabel;
    const refinementString = `~${field || this.categoryField}=${refinement}`;
    if (this.autoSearch) {
      this.searchProducts(field ? '' : query, isRefinement ? refinementString : undefined);
    }
    this.rewriteQuery(query);
  }

  processResults(result: any) {
    let categoryResults = [];

    this.matchesInput = result.searchTerms
      && result.searchTerms[0].value.toLowerCase() === this.originalQuery.toLowerCase();

    if (this.matchesInput) {
      const [categoryQuery] = result.searchTerms.splice(0, 1);
      categoryResults = this.extractCategoryResults(categoryQuery);
    }

    const navigations = result.navigations ? result.navigations
      .map((nav) => Object.assign(nav, { displayName: this.navigationNames[nav.name] || nav.name }))
      .filter(({name}) => this.allowedNavigations.includes(name)) : [];
    this.update({
      results: result,
      navigations,
      queries: result.searchTerms,
      categoryResults
    });
  }

  extractCategoryResults({ additionalInfo, value }: any) {
    let categoryResults = [];
    const categoryField = this.categoryField;
    if (additionalInfo && categoryField && categoryField in additionalInfo) {
      categoryResults = additionalInfo[categoryField]
        .map((category) => ({ category, value }))
        .slice(0, 3);
      categoryResults.unshift({ category: this.allCategoriesLabel, value, noRefine: true });
    }
    return categoryResults;
  }

  searchRefinement(event: Event) {
    this.flux.resetRecall();
    this.refine(<HTMLElement>event.target, '');
  }

  searchCategory(event: Event) {
    this.flux.resetRecall();
    this.refine(<HTMLElement>event.target, this.originalQuery);
  }

  highlightCurrentQuery(value: string, regexReplacement: string) {
    return this.highlight
      ? value.replace(new RegExp(escapeStringRegexp(this.originalQuery), 'i'), regexReplacement)
      : value;
  }

  enhanceCategoryQuery(query: any) {
    return `<b>${query.value}</b> in <span class="gb-category-query">${query.category}</span>`;
  }

  refine(node: HTMLElement, queryString: string) {
    while (node.tagName !== 'GB-SAYT-LINK') node = node.parentElement;

    const doRefinement = !node.dataset['norefine'];
    const refinement: SelectedValueRefinement = {
      navigationName: node.dataset['field'] || this.categoryField,
      value: node.dataset['refinement'],
      type: 'Value'
    };

    if (this.staticSearch && this.services.url.isActive()) {
      return Promise.resolve(this.services.url.update(this.flux.query.withQuery(queryString)
        .withConfiguration(<any>{ refinements: doRefinement ? [refinement] : [] })));
    } else if (doRefinement) {
      this.flux.rewrite(queryString, { skipSearch: true });
      return this.flux.refine(refinement)
        .then(this.emitEvent);
    } else {
      return this.flux.reset(queryString)
        .then(this.emitEvent);
    }
  }

  search(event: Event) {
    let node = <HTMLElement>event.target;
    while (node.tagName !== 'GB-SAYT-LINK') node = node.parentElement;

    const query = node.dataset['value'];

    if (this.staticSearch && this.services.url.isActive()) {
      return Promise.resolve(this.services.url.update(this.flux.query
        .withConfiguration(<any>{ query, refinements: [] })));
    } else {
      this.rewriteQuery(query);
      return this.flux.reset(query)
        .then(this.emitEvent);
    }
  }

  listenForInput(tag: Query) {
    const input = <HTMLInputElement>tag.searchBox;
    input.autocomplete = 'off';
    const debouncedSearch = debounce(this.debouncedSearch(input), Math.max(this.delay, MIN_DELAY));
    input.addEventListener('input', debouncedSearch);
    document.addEventListener('click', this.reset);
  }

  debouncedSearch(input: HTMLInputElement) {
    return () => {
      if (input.value.length >= this.minimumCharacters) {
        this.fetchSuggestions(input.value);
      } else {
        this.reset();
      }
    };
  }

  emitEvent() {
    if (this.services.tracker) {
      this.services.tracker.sayt();
    }
  }
}
