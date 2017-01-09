import { checkBooleanAttr } from '../../utils/common';
import { FluxTag } from '../tag';
import * as riot from 'riot'; // tslint:disable-line:no-unused-variable

export interface Selectable {
  options: any[];
  onSelect: () => void;
  iconUrl?: string;
  label?: string;
  clear?: string;
  hover?: boolean;
  native?: boolean;
}

export interface Select extends FluxTag<any> {
  $selectable: Selectable;
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
  options: any[];
  iconUrl: string;
  label: string;
  hover: boolean;
  native: boolean;

  clearOption: { label: string, clear: boolean };
  onSelect: Function;
  selectedOption: any;
  default: boolean;
  selected: any;
  focused: boolean;

  init() {
    this.alias('select');

    const selectable = this.selectable();
    this.options = selectable.options || [];
    this.onSelect = selectable.onSelect;
    this.iconUrl = selectable.iconUrl || require('./arrow-down.png');
    this.label = selectable.label || 'Select';
    this.hover = checkBooleanAttr('hover', selectable);
    this.native = checkBooleanAttr('native', selectable);

    this.clearOption = { label: selectable.clear || 'Unselect', clear: true };
    this.default = !('clear' in selectable);

    if (this.default) {
      this.selectedOption = typeof this.options[0] === 'object' ? this.options[0].label : this.options[0];
    }
  }

  selectable() {
    return Object.assign({}, this.$selectable, this.opts);
  }

  updateOptions(options: any[]) {
    this.update({ options: this.default ? options : [this.clearOption, ...options] });
  }

  selectLabel(): string {
    return this.selectedOption || (this.selected ? this.clearOption : this.label);
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

  selectOption(selectedOption: string, value: any): void {
    this.update({ selectedOption });
    if (this.onSelect) {
      try {
        this.onSelect(JSON.parse(value));
      } catch (e) {
        this.onSelect(value || '*');
      }
    }
  }

  selectNative(event: Event & { target: HTMLSelectElement; }) {
    const [option] = Array.from(event.target.selectedOptions);
    const selected = option.value;
    this.nativeSelect().options[0].disabled = !selected;
    this.update({ selected });
    this.selectOption(option.text, selected);
  }

  selectCustom({ value, label }: { value: string, label: string }) {
    this.selectButton().blur();
    this.selectOption(label, value);
  }

  clearSelection() {
    return this.selectOption(undefined, '*');
  }

  optionValue(option: any) {
    return typeof option === 'object' ? JSON.stringify(option.value) : option;
  }

  optionLabel(option: any) {
    return typeof option === 'object' ? option.label : option;
  }
}
