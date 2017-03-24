import { Linkable, LinkTag } from '../link-list/gb-link-list';
import { FluxTag } from '../tag';
import * as riot from 'riot'; // tslint:disable-line:no-unused-variable

export interface Selectable extends Linkable {
  iconUrl?: string;
  label?: string;
  clear?: string;
  hover?: boolean;
  native?: boolean;
}

export interface LabeledOption {
  label: string;
  value: string;
}

export type SelectOption = string | LabeledOption;

export interface SelectTag<T extends Selectable> extends Selectable { }

export class SelectTag<T extends Selectable> extends LinkTag<T> { }

export const DEFAULTS = {
  items: [],
  iconUrl: require('./arrow-down.png'),
  label: 'Select'
};
export const TYPES = {
  hover: 'boolean',
  native: 'boolean'
};

export class Select extends FluxTag<any> {
  $selectable: Selectable;
  tags: {
    'gb-native-select': FluxTag<any> & {
      refs: { selector: HTMLSelectElement; };
    };
    'gb-custom-select': FluxTag<any> & {
      tags: { 'gb-select-button': FluxTag<any>; };
    };
  };

  clearItem: { label: string, clear: boolean };
  selectedItem: any;
  default: boolean;
  selected: any;
  focused: boolean;

  init() {
    this.expose('select');
    this.transform('selectable', ['linkable', 'listable'], { defaults: DEFAULTS, types: TYPES });

    this.on('update', this.setClearItem);
  }

  setDefaults() {
    this.clearItem = { label: this.$selectable.clear || 'Unselect', clear: true };
    this.default = !this.$selectable.clear;

    if (this.default) {
      const items = this.$selectable.items;
      this.selectedItem = typeof items[0] === 'object' ? items[0].label : items[0];
    }
  }

  setClearItem() {
    if (!this.default && !this.$selectable.items.includes(this.clearItem)) {
      this.$selectable.items.unshift(this.clearItem);
    }
  }

  selectLabel(): string {
    return this.selectedItem || (this.selected ? this.clearItem : this.$selectable.label);
  }

  prepFocus() {
    return this.focused = false;
  }

  selectButton() {
    return this.tags['gb-custom-select'].tags['gb-select-button'].root;
  }

  nativeSelect() {
    if (this.tags['gb-native-select']) {
      return this.tags['gb-native-select'].refs.selector;
    } else {
      return this.root.querySelector('select');
    }
  }

  focusElement(e) {
    e.preventUpdate = true;
    this.selectButton().focus();
  }

  unfocus() {
    this.focused = this.$selectable.hover || !this.focused;
    if (!this.focused) {
      this.selectButton().blur();
    }
  }

  selectItem(selectedItem: string, value: any): void {
    this.update({ selectedItem });
    if (this.$selectable.onSelect) {
      try {
        this.$selectable.onSelect(JSON.parse(value));
      } catch (e) {
        this.$selectable.onSelect(value || '*');
      }
    }
  }

  selectNative({ target }: { target: HTMLSelectElement }) {
    const [item] = Array.from(target.selectedOptions);
    const selected = item.value;
    this.nativeSelect().options[0].disabled = !selected;
    this.update({ selected });
    this.selectItem(item.text, selected);
  }

  selectCustom({ value, label }: { value: string, label: string }) {
    this.selectButton().blur();
    this.selectItem(label, value);
  }

  clearSelection() {
    return this.selectItem(undefined, '*');
  }

  itemValue(item: any) {
    return typeof item === 'object' ? JSON.stringify(item.value) : item;
  }

  itemLabel(item: any) {
    return typeof item === 'object' ? item.label : item;
  }

  shouldRender(item: any) {
    return !item.clear || this.selectedItem;
  }
}
