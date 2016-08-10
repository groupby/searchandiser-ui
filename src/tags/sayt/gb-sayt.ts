import { FluxTag } from '../tag';
import { Events } from 'groupby-api';
import { Autocomplete } from './autocomplete';
import { Query } from '../query/gb-query';
import { findTag, getPath, updateLocation } from '../../utils';
import debounce = require('debounce');
import escapeStringRegexp = require('escape-string-regexp');
const sayt = require('sayt');

const DEFAULT_CONFIG = {
  products: 4,
  queries: 5,
  autoSearch: true,
  highlight: true,
  navigationNames: {},
  allowedNavigations: []
};
const ESCAPE_KEY = 27;

export interface Sayt extends FluxTag { }

export class Sayt {

  struct: any;
  saytConfig: any;
  autocomplete: Autocomplete;
  autocompleteList: HTMLUListElement;
  categoryField: string;
  queryParam: string;
  originalQuery: string;
  searchUrl: string;
  showProducts: boolean;
  queries: any[];

  init() {
    this.saytConfig = Object.assign({}, DEFAULT_CONFIG, getPath(this.config, 'tags.sayt'));
    this.categoryField = this.saytConfig.categoryField;
    this.struct = Object.assign({}, this.config.structure, this.saytConfig.structure);
    this.searchUrl = this.opts.searchUrl || '/search';
    this.queryParam = this.opts.queryParam || 'q';
    this.showProducts = this.saytConfig.products > 0;

    sayt.configure({
      subdomain: this.config.customerId,
      collection: this.saytConfig.collection || this.config.collection,
      autocomplete: { numSearchTerms: this.saytConfig.queries },
      productSearch: {
        area: this.saytConfig.area || this.config.area,
        numProducts: this.saytConfig.products
      }
    });

    this.on('mount', () => this.autocomplete = new Autocomplete(this));

    this.flux.on('autocomplete', (originalQuery) => sayt.autocomplete(originalQuery)
      .then(({result}) => {
        this.update({ originalQuery });
        this.processResults(result);
        if (this.queries && this.showProducts) this.searchProducts(this.queries[0].value);
      })
      .catch((err) => console.error(err)));

    this.flux.on('autocomplete:hide', () => {
      this.autocomplete.reset();
      this.update({ queries: null, navigations: null });
    });
  }

  searchProducts(query) {
    if (this.saytConfig.products) {
      sayt.productSearch(query)
        .then((res) => this.update({ products: res.result.products }));
    }
  }

  rewriteQuery(query: string) {
    this.flux.emit(Events.REWRITE_QUERY, query);
  }

  notifier(query) {
    if (this.saytConfig.autoSearch) this.searchProducts(query);
    this.rewriteQuery(query);
  }

  processResults(result) {
    let categoryResults = [];
    if (result.searchTerms && result.searchTerms[0].value === this.originalQuery) {
      const categoryQuery = result.searchTerms[0];
      result.searchTerms.splice(0, 1);

      if (this.categoryField && categoryQuery.additionalInfo[this.categoryField]) {
        categoryResults = categoryQuery.additionalInfo[this.categoryField]
          .map((value) => ({
            category: value,
            value: categoryQuery.value
          })).slice(0, 3);
        categoryResults.unshift({
          category: 'All Departments',
          value: categoryQuery.value
        });
      }
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

  searchRefinement(event) {
    this.flux.reset();
    this.refine(event.target, '');
  }

  searchCategory(event) {
    this.flux.reset();
    this.refine(event.target, this.originalQuery);
  }

  highlightCurrentQuery(value: string, regexReplacement: string) {
    return this.saytConfig.highlight ? value.replace(new RegExp(escapeStringRegexp(this.originalQuery), 'i'), regexReplacement) : value;
  }

  enhanceCategoryQuery(query) {
    if (this.saytConfig.categoryField) {
      return `<b>${query.value}</b> in <span class="gb-category-query">${query.category}</span>`;
    } else {
      return query.value;
    }
  }

  refine(node, query) {
    while (node.tagName !== 'GB-SAYT-LINK') node = node.parentNode;

    if (this.opts.staticSearch && window.location.pathname !== this.searchUrl) {
      return updateLocation(this.opts.searchUrl || '/search', this.opts.queryParam || 'q', query, [
        {
          navigationName: node.dataset['field'],
          type: 'Value',
          value: node.dataset['refinement']
        }
      ]);
    }

    this.flux.refine({
      navigationName: node.dataset['field'],
      type: 'Value',
      value: node.dataset['refinement']
    }).then(() => this.flux.rewrite(query))
  }

  search(event) {
    let node = event.target;
    while (node.tagName !== 'GB-SAYT-LINK') node = node.parentNode;

    if (this.opts.staticSearch && window.location.pathname !== this.searchUrl) {
      return updateLocation(this.searchUrl, this.queryParam, node.dataset['value'], []);
    }

    const query = node.dataset['value']
    this.rewriteQuery(query)
    this.flux.reset(query);
  }

  static listenForInput(tag: Query) {
    const input = <HTMLInputElement>tag.searchBox;
    input.autocomplete = 'off';
    const minimumCharacters = tag.config.tags.sayt.minimumCharacters || 1;
    const delay = tag.config.tags.sayt.delay || 0;
    const debouncedSearch = debounce(() => {
      if (input.value.length >= minimumCharacters) {
        tag.flux.emit('autocomplete', input.value);
      } else {
        tag.flux.emit('autocomplete:hide');
      }
    }, delay);
    document.addEventListener('click', () => tag.flux.emit('autocomplete:hide'));
    input.addEventListener('input', debouncedSearch);
    input.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.keyCode === ESCAPE_KEY) tag.flux.emit('autocomplete:hide');
    });
  }
}
