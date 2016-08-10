import { Query } from '../query/gb-query';
import debounce = require('debounce');
import riot = require('riot');

export class QueryWrapper {
  constructor(public tag: Query) { }

  mount() {
    this.tag.on('before-mount', () => this.initializeSayt());
    this.tag.on('mount', () => this.wrapElement());
  }

  initializeSayt() {
    const root = <HTMLInputElement>this.tag.root;
    root.autocomplete = 'off';
    const minimumCharacters = this.tag.config.tags.sayt.minimumCharacters || 1;
    const delay = this.tag.config.tags.sayt.delay || 0;
    const debouncedSearch = debounce(() => {
      if (root.value.length >= minimumCharacters) {
        this.tag.flux.emit('autocomplete', root.value);
      } else {
        this.tag.flux.emit('autocomplete:hide');
      }
    }, delay);
    document.addEventListener('click', () => this.tag.flux.emit('autocomplete:hide'));
    root.addEventListener('input', debouncedSearch);
  }

  wrapElement() {
    const saytNode = document.createElement('div');
    saytNode.classList.add('gb-sayt-target');
    (<Element>this.tag.root.parentNode).classList.add('gb-query-wrapper');
    this.tag.root.parentNode.appendChild(saytNode);
    riot.mount(saytNode, 'gb-sayt', this.tag.parentOpts);
  }
}
