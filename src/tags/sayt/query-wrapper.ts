export function mount(tag: Riot.Tag.Instance, opts: any) {
  tag.on('before-mount', initSayt(tag, opts));
  tag.on('mount', wrapElement(tag.root, opts));
}

function initSayt(tag: Riot.Tag.Instance & any, opts: any): () => void {
  const root: HTMLInputElement = <HTMLInputElement>tag.root;
  return () => {
    root.autocomplete = 'off';
    document.addEventListener('click', () => opts.flux.emit('autocomplete:hide'));
    root.addEventListener('input', () => {
      if (root.value) {
        opts.flux.emit('autocomplete', root.value);
      } else {
        opts.flux.emit('autocomplete:hide');
      }
    });
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
