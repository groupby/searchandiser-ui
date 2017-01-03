import { FluxTag } from '../tag';
import * as riot from 'riot'; // tslint:disable-line:no-unused-variable

export interface SelectConfig {
  label?: string;
  clear?: string;
  hover?: boolean;
  native?: boolean;
}

export interface SelectTag<T extends SelectConfig> extends FluxTag<T> {
  options: any[];
  onselect: Function;
}

export interface Select<T extends SelectConfig> extends FluxTag<T> {
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
  $scope: SelectTag<T>;
}

export class Select<T extends SelectConfig> {

  iconUrl: string;
  label: string;
  clearOption: { label: string, clear: boolean };
  options: any[];
  callback: Function;
  selectedOption: any;
  default: boolean;
  selected: any;
  focused: boolean;

  init(): void {
    this.$config = this.$scope.$config;

    this.iconUrl = require('./arrow-down.png');
    this.label = this.$config.label || 'Select';
    this.clearOption = { label: this.$config.clear || 'Unselect', clear: true };
    this.options = this.$scope.options || [];
    this.callback = this.$scope.onselect;
    this.default = !('clear' in this.$config);

    if (this.default) {
      this.selectedOption = typeof this.options[0] === 'object' ? this.options[0].label : this.options[0];
    }
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
    this.focused = this.$config.hover || !this.focused;
    if (!this.focused) this.selectButton().blur();
  }

  selectOption(selectedOption: string, value: any): void {
    this.update({ selectedOption });
    if (this.callback) {
      try {
        this.callback(JSON.parse(value));
      } catch (e) {
        this.callback(value || '*');
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

  static optionValue(option: any) {
    return typeof option === 'object' ? JSON.stringify(option.value) : option;
  }

  static optionLabel(option: any) {
    return typeof option === 'object' ? option.label : option;
  }
}
