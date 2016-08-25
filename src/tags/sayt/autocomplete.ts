import { Sayt } from './gb-sayt';
import { findSearchBox } from '../../utils';
import { FluxTag } from '../tag';

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
  preautocompleteValue: string;

  constructor(public tag: Sayt) {
    this.selected = this.searchInput = findSearchBox();
  }



  selectFirstLink() {
    this.selected = this.swap(<HTMLElement>((<FluxTag>this.tag).root.querySelector('gb-sayt-autocomplete gb-sayt-link')));
  }

  getOneAbove(): HTMLElement {
    const links = this.links();
    const i = links.indexOf(this.selected);
    return <HTMLElement>links[i - 1];
  }

  getOneBelow(): HTMLElement {
    const links = this.links();
    const i = links.indexOf(this.selected);
    return <HTMLElement>links[i + 1];
  }

  selectOneAbove() {
    let link = this.getOneAbove();
    if (link) this.selected = this.swap(link);
  }

  selectOneBelow() {
    let link = this.getOneBelow();
    if (link) this.selected = this.swap(link);
  }

  links() {
    return Array.from((<FluxTag>this.tag).root.querySelectorAll('gb-sayt-autocomplete gb-sayt-link'));
  }

  isSelectedInAutocomplete() {
    const links = Array.from((<FluxTag>this.tag).root.querySelectorAll('gb-sayt-autocomplete gb-sayt-link'));
    return links.indexOf(this.selected) !== -1;
  }


  swap(next: HTMLElement) {
    if (next) {
      this.removeActiveClass();
      next.classList.add(ACTIVE);
      if (next.getAttribute(DATA_VALUE)) this.tag.notifier(next.getAttribute(DATA_VALUE));
      return next;
    }
    return this.selected;
  }


  resetSelected() {
    this.selected = this.searchInput;
  }

  removeActiveClass() {
    Array.from(this.tag.root.querySelectorAll('gb-sayt-autocomplete gb-sayt-link'))
      .forEach(element => element.classList.remove('active'));
  }

  reset() {
    this.removeActiveClass();
    this.resetSelected();
  }
}
