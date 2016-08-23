import { Sayt } from './gb-sayt';
import { findSearchBox } from '../../utils';

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
    this.selected = this.searchInput = findSearchBox();
    this.searchInput.addEventListener('keydown', (event) => this.keyListener(event));
  }

  reset() {
    this.selected = this.searchInput;
  }

  keyListener(event: KeyboardEvent) {
    const links = Array.from(this.tag.root.querySelectorAll('gb-sayt-autocomplete gb-sayt-link'));
    const i = links.indexOf(this.selected);
    switch (event.keyCode) {
      case KEY_DOWN:
        if (this.selected === this.searchInput) {
          this.originalValue = this.searchInput.value;
          this.selected = this.swap(<HTMLElement>links[0]);
        } else {
          const nodeBelow = links[i + 1];
          if (nodeBelow) {
            this.selected = this.swap(<HTMLElement>nodeBelow);
          }
        }
        break;
      case KEY_UP:
        event.preventDefault();
        if (this.selected === links[0]) {
          this.searchInput.value = this.originalValue;
          this.selected = this.swap(this.searchInput);
        } else {
          const nodeAbove = links[i - 1];
          if (nodeAbove) {
            this.selected = this.swap(<HTMLElement>nodeAbove);
          }
        }
        break;
      case KEY_ENTER:
        event.preventDefault();
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
      if (next.getAttribute(DATA_VALUE)) this.tag.notifier(next.getAttribute(DATA_VALUE));
      return next;
    }
    return this.selected;
  }

  removeActive() {
    Array.from(this.tag.root.querySelectorAll('gb-sayt-autocomplete gb-sayt-link'))
      .forEach(element => element.classList.remove('active'));
  }
}
