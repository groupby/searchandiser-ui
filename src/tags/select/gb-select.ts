import { checkBooleanAttr } from '../../utils/common';
import { Linkable } from '../link-list/gb-link-list';
import { Listable } from '../list/gb-list';
import { FluxTag } from '../tag';
import * as riot from 'riot'; // tslint:disable-line:no-unused-variable

export interface Selectable extends Linkable {
  iconUrl?: string;
  label?: string;
  clear?: string;
  hover?: boolean;
  native?: boolean;
}

export interface Select extends FluxTag<any> {
  $selectable: Selectable;
  $linkable: Linkable;
  $listable: Listable;
  tags: {
    'gb-native-select': FluxTag<any> & {
      refs: {
        selector: HTMLSelectElement;
      };
    };
    'gb-custom-select': FluxTag<any> & {
      tags: {
        'gb-select-button': FluxTag<any>;
      };
    };
  };
}

export class Select {
  items: any[];
  iconUrl: string;
  label: string;
  hover: boolean;
  native: boolean;

  clearItem: { label: string, clear: boolean };
  onSelect: Function;
  selectedItem: any;
  default: boolean;
  selected: any;
  focused: boolean;

  init() {
    const selectable = this.selectable();
    this.alias('select');
    this.alias(['listable', 'linkable'], selectable);

    this.items = selectable.items || [];
    this.onSelect = selectable.onSelect;
    this.iconUrl = selectable.iconUrl || require('./arrow-down.png');
    this.label = selectable.label || 'Select';
    this.hover = checkBooleanAttr('hover', selectable);
    this.native = checkBooleanAttr('native', selectable);

    this.clearItem = { label: selectable.clear || 'Unselect', clear: true };
    this.default = !('clear' in selectable);

    if (this.default) {
      this.selectedItem = typeof this.items[0] === 'object' ? this.items[0].label : this.items[0];
    }

    this.on('update', this.updateAliases);
  }

  updateAliases() {
    // this should also update $listable as they reference the same object
    this.selectable(this.$linkable);
  }

  selectable(obj: any = {}) {
    return Object.assign(obj, this.$selectable, this.opts);
  }

  updateItems(items: any[]) {
    this.update({ items: this.default ? items : [this.clearItem, ...items] });
  }

  selectLabel(): string {
    return this.selectedItem || (this.selected ? this.clearItem : this.label);
  }

  prepFocus() {
    return this.focused = false;
  }

  selectButton() {
    const customSelect = this.tags['gb-custom-select'];
    return customSelect.tags['gb-select-button'].root;
  }

  nativeSelect() {
    if (this.tags['gb-native-select']) {
      return this.tags['gb-native-select'].refs.selector;
    } else {
      return this.root.querySelector('select');
    }
  }

  unfocus() {
    this.focused = this.hover || !this.focused;
    if (!this.focused) this.selectButton().blur();
  }

  selectItem(selectedItem: string, value: any): void {
    this.update({ selectedItem });
    if (this.onSelect) {
      try {
        this.onSelect(JSON.parse(value));
      } catch (e) {
        this.onSelect(value || '*');
      }
    }
  }

  selectNative(event: Event & { target: HTMLSelectElement; }) {
    const [item] = Array.from(event.target.selectedOptions);
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
    return item.clear ? this.selectedItem : true;
  }
}
