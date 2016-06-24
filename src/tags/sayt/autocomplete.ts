const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_ENTER = 13;
const KEY_BACKSPACE = 8;
const KEY_DEL = 46;
const DATA_VALUE = 'data-value';
const ACTIVE = 'active';
const ITEM_TAG = 'LI';

let selectedNode,
  originalValue: string,
  searchInput: HTMLInputElement,
  queryUpdateNotifier: (string) => void;


export function init(root: Node, autocompleteList: Element, notifier: (string) => void) {
  selectedNode = searchInput = <HTMLInputElement>root.parentNode.firstChild;
  queryUpdateNotifier = notifier;
  searchInput.onkeydown = keyListener(autocompleteList);
}

export function reset() {
  selectedNode = searchInput;
}

function swap<T extends Element>(selected: T, next: T): T {
  if (next) {
    selected.classList.remove(ACTIVE);
    next.classList.add(ACTIVE);
    if (next.firstElementChild) queryUpdateNotifier(next.getAttribute(DATA_VALUE));
    return next;
  }
  return selected;
}

function keyListener(autocompleteList: Element) {
  return (event: KeyboardEvent) => {
    const firstLink = autocompleteList.firstElementChild;
    switch (event.keyCode) {
      case KEY_UP:
        event.preventDefault();
        if (selectedNode === firstLink) {
          searchInput.value = originalValue;
          selectedNode = swap(selectedNode, searchInput);
        } else {
          let nextNode = selectedNode.previousElementSibling;
          if (nextNode && nextNode.tagName) {
            while (nextNode.tagName !== ITEM_TAG) {
              nextNode = nextNode.previousElementSibling;
            }
          }
          selectedNode = swap(selectedNode, nextNode);
        }
        break;
      case KEY_DOWN:
        if (selectedNode === searchInput) {
          originalValue = searchInput.value;
          selectedNode = swap(selectedNode, firstLink);
        } else {
          let nextNode = selectedNode.nextElementSibling;
          if (nextNode && nextNode.tagName) {
            while (nextNode.tagName !== ITEM_TAG) {
              nextNode = nextNode.nextElementSibling;
            }
          }
          selectedNode = swap(selectedNode, nextNode);
        }
        break;
      case KEY_ENTER:
        if (selectedNode !== searchInput) {
          selectedNode.firstElementChild.click();
          reset();
        }
        break;
      default:
        reset();
        break;
    }
  };
}
