import { FluxTag } from '../tag';

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
  _scope: SelectTag<T>;
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
    this._config = this._scope._config;

    this.iconUrl = require('./arrow-down.png');
    this.label = this._config.label || 'Select';
    this.clearOption = { label: this._config.clear || 'Unselect', clear: true };
    this.options = this._scope.options || [];
    this.callback = this._scope.onselect;
    this.default = !('clear' in this._config);

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
    this.focused = this._config.hover || !this.focused;
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
