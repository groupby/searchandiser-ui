import { findSearchBox } from '../../utils/common';
import { Sayt } from './gb-sayt';

const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_ENTER = 13;
const KEY_ESCAPE = 27;
const ACTIVE = 'active';

export const AUTOCOMPLETE_HIDE_EVENT = 'autocomplete:hide';

export class Autocomplete {

  selected: HTMLElement;
  searchInput: HTMLInputElement;
  preautocompleteValue: string;

  constructor(public tag: Sayt) {
    this.selected = this.searchInput = findSearchBox();
  }

  indexOfSelected() {
    return this.links().indexOf(this.selected);
  }

  selectLink(link: HTMLElement) {
    if (link) this.selected = this.swapAttributes(link);
  }

  linkAbove() {
    return <HTMLElement>this.links()[this.indexOfSelected() - 1];
  }

  linkBelow() {
    return <HTMLElement>this.links()[this.indexOfSelected() + 1];
  }

  links() {
    return Array.from(this.tag.root.querySelectorAll('gb-sayt-autocomplete gb-sayt-link'));
  }

  isSelectedInAutocomplete() {
    return this.links().indexOf(this.selected) !== -1;
  }

  swapAttributes(next: HTMLElement) {
    this.removeActiveClass();
    next.classList.add(ACTIVE);
    if (next.dataset['value']) this.tag.notifier(next.dataset['value']);
    return next;
  }

  resetSelected() {
    this.selected = this.searchInput;
  }

  removeActiveClass() {
    this.links().forEach((element) => element.classList.remove(ACTIVE));
  }

  reset() {
    this.removeActiveClass();
    this.resetSelected();
  }

  keyboardListener(event: KeyboardEvent, submitDefault: Function) {
    switch (event.keyCode) {
      case KEY_UP:
        // prevent cursor from moving to front of text box
        event.preventDefault();

        if (this.isSelectedInAutocomplete()) {
          if (this.linkAbove()) {
            this.selectLink(this.linkAbove());
          } else {
            this.searchInput.value = this.preautocompleteValue;
            this.reset();
          }
        } else {
          this.tag.flux.emit(AUTOCOMPLETE_HIDE_EVENT);
        }
        break;
      case KEY_DOWN:
        if (this.isSelectedInAutocomplete()) {
          this.selectLink(this.linkBelow());
        } else {
          this.preautocompleteValue = this.searchInput.value;
          this.selectLink(this.linkBelow());
        }
        break;
      case KEY_ENTER:
        if (this.isSelectedInAutocomplete()) {
          this.selected.querySelector('a').click();
          this.reset();
        } else {
          submitDefault();
        }
        break;
      case KEY_ESCAPE:
        this.tag.flux.emit(AUTOCOMPLETE_HIDE_EVENT);
        break;
    }
  }
}
