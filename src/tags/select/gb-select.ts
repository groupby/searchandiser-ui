import { unless } from '../../utils';
import { FluxTag } from '../tag';

export interface Select extends FluxTag { }

export class Select {

  iconUrl: string;
  label: string;
  clearOption: { label: string, clear: boolean };
  options: any[];
  hover: boolean;
  native: boolean;
  callback: Function;
  selectedOption: any;
  selected: any;
  focused: boolean;
  default: boolean;

  init(): void {
    this.iconUrl = require('url!./arrow-down.png');

    const _scope = this._scope;
    this.clearOption = {
      label: _scope.clear || 'Unselect',
      clear: true
    };
    this.options = unless(_scope.options, []);

    this.callback = _scope.onselect;
    this.default = _scope.clear === undefined;
    this.label = _scope.label || 'Select';

    this.hover = unless(_scope.opts.hover, true);
    this.native = _scope.opts.native !== undefined;

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
    return this.tags['gb-custom-select'].tags['gb-select-button'].root;
  }

  nativeSelect() {
    if (this.tags['gb-native-select']) {
      return this.tags['gb-native-select'].selector;
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
    if (this.callback) {
      try {
        this.callback(JSON.parse(value));
      } catch (e) {
        this.callback(value || '*');
      }
    }
  }

  selectNative(event: Event) {
    const [option] = Array.from((<HTMLSelectElement>event.target).selectedOptions);
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

export interface SelectTag extends FluxTag {
  options: any[];
  onselect: Function;

  label?: string;
  hover?: boolean;
  clear?: string;
}
