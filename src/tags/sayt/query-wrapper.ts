import { Query } from '../query/gb-query';
import debounce = require('debounce');

export function mount(tag: Query) {
  tag.on('before-mount', initSayt(tag));
  tag.on('mount', wrapElement(tag.root, tag.parentOpts));
}

function initSayt(tag: Query): () => void {
  const root: HTMLInputElement = <HTMLInputElement>tag.root;
  return () => {
    root.autocomplete = 'off';
    const minimumCharacters = tag.parentOpts.config.sayt.minimumCharacters || 1;
    const delay = tag.parentOpts.config.sayt.delay || 0;
    const debouncedSearch = debounce(() => {
      if (root.value.length >= minimumCharacters) {
        tag.parentOpts.flux.emit('autocomplete', root.value);
      } else {
        tag.parentOpts.flux.emit('autocomplete:hide');
      }
    }, delay);
    document.addEventListener('click', () => tag.parentOpts.flux.emit('autocomplete:hide'));
    root.addEventListener('input', debouncedSearch);
  };
}

function wrapElement(root: Node, opts: any): () => void {
  return () => {
    const queryWrapper = document.createElement('span');
    queryWrapper.classList.add('gb-query-wrapper');
    const saytNode = document.createElement('div');
    saytNode.classList.add('gb-sayt-target');
    root.parentNode.insertBefore(queryWrapper, root);
    queryWrapper.appendChild(root);
    queryWrapper.appendChild(saytNode);
    riot.mount(saytNode, 'gb-sayt', opts);
  };
}
