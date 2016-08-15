import { Sayt } from './gb-sayt';
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

  constructor(public tag: Sayt) {
    this.selected = this.searchInput = <HTMLInputElement>findTag('gb-query')['_tag'].searchBox;
    this.searchInput.addEventListener('keydown', (event) => this.keyListener(event));
  }

  reset() {
    this.selected = this.searchInput;
  }

  keyListener(event: KeyboardEvent) {
    const firstLink = this.tag.autocompleteList.firstElementChild;
    switch (event.keyCode) {
      case KEY_UP:
        event.preventDefault();
        if (this.selected === firstLink) {
          this.searchInput.value = this.originalValue;
          this.selected = this.swap(this.searchInput);
        } else {
          let nextNode = this.selected.previousElementSibling;
          if (nextNode && nextNode.tagName) {
            while (nextNode.tagName !== ITEM_TAG) {
              nextNode = nextNode.previousElementSibling;
            }
          }
          this.selected = this.swap(<HTMLElement>nextNode);
        }
        break;
      case KEY_DOWN:
        if (this.selected === this.searchInput) {
          this.originalValue = this.searchInput.value;
          this.selected = this.swap(<HTMLElement>firstLink);
        } else {
          let nextNode = this.selected.nextElementSibling;
          if (nextNode && nextNode.tagName) {
            while (nextNode.tagName !== ITEM_TAG) {
              nextNode = nextNode.nextElementSibling;
            }
          }
          this.selected = this.swap(<HTMLElement>nextNode);
        }
        break;
      case KEY_ENTER:
        if (this.selected !== this.searchInput) {
          (<HTMLElement>this.selected.firstElementChild).click();
          this.removeActive();
          this.reset();
        }
        break;
      default:
        this.removeActive();
        this.reset();
        break;
    }
  }

  swap(next: HTMLElement) {
    if (next) {
      this.removeActive();
      next.classList.add(ACTIVE);
      if (next.firstElementChild) this.tag.notifier(next.getAttribute(DATA_VALUE));
      return next;
    }
    return this.selected;
  }

  removeActive() {
    Array.from(this.tag.autocompleteList.getElementsByClassName('gb-autocomplete__item'))
      .forEach(element => element.classList.remove('active'));
  }
}
