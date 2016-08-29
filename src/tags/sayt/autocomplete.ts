import { Sayt } from './gb-sayt';
import { findSearchBox } from '../../utils';

const ACTIVE = 'active';

export class Autocomplete {

  selected: HTMLElement;
  searchInput: HTMLInputElement;
  preautocompleteValue: string;

  constructor(public tag: Sayt) {
    this.selected = this.searchInput = findSearchBox();
  }

  selectFirstLink() {
    this.selected = this.swap(<HTMLElement>this.tag.root.querySelector('gb-sayt-autocomplete gb-sayt-link'));
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
    return Array.from(this.tag.root.querySelectorAll('gb-sayt-autocomplete gb-sayt-link'));
  }

  isSelectedInAutocomplete() {
    const links = Array.from(this.tag.root.querySelectorAll('gb-sayt-autocomplete gb-sayt-link'));
    return links.indexOf(this.selected) !== -1;
  }


  swap(next: HTMLElement) {
    if (next) {
      this.removeActiveClass();
      next.classList.add(ACTIVE);
      if (next.dataset['value']) this.tag.notifier(next.dataset['value']);
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
