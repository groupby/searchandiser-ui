import { findTag } from '../../utils';

const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_ENTER = 13;
const KEY_BACKSPACE = 8;
const KEY_DEL = 46;
const DATA_VALUE = 'data-value';
const ACTIVE = 'active';
const ITEM_TAG = 'LI';

export class Autocomplete {

  selected: HTMLElement;
  searchInput: HTMLInputElement;
  originalValue: string;
  notifier: (string) => void;

  constructor(root: HTMLElement, autocompleteList: HTMLUListElement, notifier: (query: string) => void) {
    this.selected = this.searchInput = <HTMLInputElement>findTag('gb-raw-query');
    this.notifier = notifier;
    this.searchInput.onkeydown = this.keyListener(autocompleteList);
  }

  reset() {
    this.selected = this.searchInput;
  }

  keyListener(autocompleteList: HTMLUListElement) {
    return (event: KeyboardEvent) => {
      const firstLink = autocompleteList.firstElementChild;
      switch (event.keyCode) {
        case KEY_UP:
          event.preventDefault();
          if (this.selected === firstLink) {
            this.searchInput.value = this.originalValue;
            this.selected = this.swap(autocompleteList, <HTMLElement>this.selected, this.searchInput);
          } else {
            let nextNode = this.selected.previousElementSibling;
            if (nextNode && nextNode.tagName) {
              while (nextNode.tagName !== ITEM_TAG) {
                nextNode = nextNode.previousElementSibling;
              }
            }
            this.selected = this.swap(autocompleteList, <HTMLElement>this.selected, <HTMLElement>nextNode);
          }
          break;
        case KEY_DOWN:
          if (this.selected === this.searchInput) {
            this.originalValue = this.searchInput.value;
            this.selected = this.swap(autocompleteList, <HTMLElement>this.selected, <HTMLElement>firstLink);
          } else {
            let nextNode = this.selected.nextElementSibling;
            if (nextNode && nextNode.tagName) {
              while (nextNode.tagName !== ITEM_TAG) {
                nextNode = nextNode.nextElementSibling;
              }
            }
            this.selected = this.swap(autocompleteList, <HTMLElement>this.selected, <HTMLElement>nextNode);
          }
          break;
        case KEY_ENTER:
          if (this.selected !== this.searchInput) {
            (<HTMLElement>this.selected.firstElementChild).click();
            this.removeActive(autocompleteList);
            this.reset();
          }
          break;
        default:
          this.removeActive(autocompleteList);
          this.reset();
          break;
      }
    };
  }

  swap<T extends HTMLElement>(autocompleteList: HTMLUListElement, selected: T, next: T): T {
    if (next) {
      this.removeActive(autocompleteList);
      next.classList.add(ACTIVE);
      if (next.firstElementChild) this.notifier(next.getAttribute(DATA_VALUE));
      return next;
    }
    return selected;
  }

  removeActive(autocompleteList: Element) {
    Array.from(autocompleteList.getElementsByClassName('gb-autocomplete__item'))
      .forEach(element => element.classList.remove('active'));
  }
}
