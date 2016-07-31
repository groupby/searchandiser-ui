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
    const minimumCharacters = this.tag.parentOpts.config.sayt.minimumCharacters || 1;
    const delay = this.tag.parentOpts.config.sayt.delay || 0;
    const debouncedSearch = debounce(() => {
      if (root.value.length >= minimumCharacters) {
        this.tag.parentOpts.flux.emit('autocomplete', root.value);
      } else {
        this.tag.parentOpts.flux.emit('autocomplete:hide');
      }
    }, delay);
    document.addEventListener('click', () => this.tag.parentOpts.flux.emit('autocomplete:hide'));
    root.addEventListener('input', debouncedSearch);
  }

  wrapElement() {
    const queryWrapper = document.createElement('span');
    queryWrapper.classList.add('gb-query-wrapper');
    const saytNode = document.createElement('div');
    saytNode.classList.add('gb-sayt-target');
    this.tag.root.parentNode.insertBefore(queryWrapper, this.tag.root);
    queryWrapper.appendChild(this.tag.root);
    queryWrapper.appendChild(saytNode);
    riot.mount(saytNode, 'gb-sayt', this.tag.parentOpts);
  }
}
