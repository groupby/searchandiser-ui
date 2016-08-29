import { findSearchBox } from '../../utils';
import { Sayt } from './gb-sayt';

const ACTIVE = 'active';

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

  selectLink(link) {
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
    this.links().forEach(element => element.classList.remove('active'));
  }

  reset() {
    this.removeActiveClass();
    this.resetSelected();
  }
}
