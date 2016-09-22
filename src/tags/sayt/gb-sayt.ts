import { debounce, getPath } from '../../utils';
import { Query } from '../query/gb-query';
import { SaytTag } from '../tag';
import { Autocomplete } from './autocomplete';
import { Events, Navigation, Record, SelectedValueRefinement } from 'groupby-api';
import escapeStringRegexp = require('escape-string-regexp');

const DEFAULT_CONFIG = {
  products: 4,
  queries: 5,
  autoSearch: true,
  staticSearch: false,
  highlight: true,
  navigationNames: {},
  allowedNavigations: []
};

export interface Sayt extends SaytTag { }

export class Sayt {

  products: Record[];
  navigations: Navigation[];
  struct: any;
  saytConfig: any;
  autocomplete: Autocomplete;
  autocompleteList: HTMLUListElement;
  categoryField: string;
  allCategoriesLabel: string;
  originalQuery: string;
  showProducts: boolean;
  matchesInput: boolean;
  queries: any[];

  init() {
    this.saytConfig = Object.assign({}, DEFAULT_CONFIG, getPath(this.config, 'tags.sayt'));
    this.categoryField = this.saytConfig.categoryField;
    this.struct = Object.assign({}, this.config.structure, this.saytConfig.structure);
    this.allCategoriesLabel = this.saytConfig.allCategoriesLabel || 'All Departments';

    this.showProducts = this.saytConfig.products > 0;

    this.sayt.configure(this.generateSaytConfig());

    this.on('mount', () => this.autocomplete = new Autocomplete(this));

    this.flux.on('autocomplete:hide', this.reset);
  }

  generateSaytConfig() {
    return {
      subdomain: this.config.customerId,
      collection: this.saytConfig.collection || this.config.collection,
      autocomplete: { numSearchTerms: this.saytConfig.queries },
      productSearch: {
        area: this.saytConfig.area || this.config.area,
        numProducts: this.saytConfig.products
      },
      https: this.saytConfig.https
    };
  }

  reset() {
    this.autocomplete.reset();
    this.update({ queries: null, navigations: null, products: null });
  }

  fetchSuggestions(originalQuery: string) {
    this.sayt.autocomplete(originalQuery)
      .then(({ result }) => {
        this.update({ originalQuery });
        this.processResults(result);
        if (this.queries && this.showProducts) {
          const query = this.matchesInput ? originalQuery : this.queries[0].value;
          this.searchProducts(query);
        }
      })
      .catch((err) => console.error(err));
  }

  searchProducts(query: string) {
    if (this.showProducts) {
      this.sayt.productSearch(query)
        .then((res) => this.update({ products: res.result.products }));
    }
  }

  rewriteQuery(query: string) {
    this.flux.emit(Events.REWRITE_QUERY, query);
    if (query !== this.flux.query.raw.query.toLowerCase()) {
      this.flux.emit(Events.QUERY_CHANGED);
    }
  }

  notifier(query: string) {
    if (this.saytConfig.autoSearch) this.searchProducts(query);
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
      .map((nav) => Object.assign(nav, { displayName: this.saytConfig.navigationNames[nav.name] || nav.name }))
      .filter(({name}) => this.saytConfig.allowedNavigations.includes(name)) : [];
    this.update({
      results: result,
      navigations,
      queries: result.searchTerms,
      categoryResults
    });
  }

  extractCategoryResults({ additionalInfo, value }: any) {
    let categoryResults = [];
    if (this.categoryField && this.categoryField in additionalInfo) {
      categoryResults = additionalInfo[this.categoryField]
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
    return this.saytConfig.highlight
      ? value.replace(new RegExp(escapeStringRegexp(this.originalQuery), 'i'), regexReplacement)
      : value;
  }

  enhanceCategoryQuery(query: any) {
    return `<b>${query.value}</b> in <span class="gb-category-query">${query.category}</span>`;
  }

  refine(node: HTMLElement, query: string) {
    while (node.tagName !== 'GB-SAYT-LINK') node = node.parentElement;

    const doRefinement = !node.dataset['norefine'];
    const refinement: SelectedValueRefinement = {
      navigationName: node.dataset['field'],
      value: node.dataset['refinement'],
      type: 'Value'
    };

    if (this.saytConfig.staticSearch && this.services.url.active()) {
      this.services.url.update(query, doRefinement ? [refinement] : []);
    } else if (doRefinement) {
      this.flux.rewrite(query, { skipSearch: true });
      this.flux.refine(refinement);
    } else {
      this.flux.reset(query);
    }
  }

  search(event: Event) {
    let node = <HTMLElement>event.target;
    while (node.tagName !== 'GB-SAYT-LINK') node = node.parentElement;

    const query = node.dataset['value'];

    if (this.saytConfig.staticSearch && this.services.url.active()) {
      this.services.url.update(query, []);
    } else {
      this.rewriteQuery(query);
      this.flux.reset(query);
    }
  }

  listenForInput(tag: Query) {
    const input = <HTMLInputElement>tag.searchBox;
    input.autocomplete = 'off';
    const minimumCharacters = this.saytConfig.minimumCharacters || 1;
    const delay = Math.max(this.saytConfig.delay || 100, 100);
    const debouncedSearch = debounce(() => {
      if (input.value.length >= minimumCharacters) {
        this.fetchSuggestions(input.value);
      } else {
        this.reset();
      }
    }, delay);
    document.addEventListener('click', this.reset);
    input.addEventListener('input', debouncedSearch);
  }
}
