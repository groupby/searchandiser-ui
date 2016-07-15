import { unless } from '../../utils';

export function Select() {

  this.init = function(): void {
    this.iconUrl = require('url!./arrow-down.png');
    this.label = this.opts.label || 'Select';
    this.clear = this.opts.clear || 'Unselect';
    this.options = this.opts.options || [];
    this.hover = unless(this.opts.hover, true);
    this.native = unless(this.opts.native, false);
    this.hasDefault = unless(this.opts.default, false);
    this.callback = this.opts.update;

    if (this.hasDefault) {
      this.selectedOption = typeof this.options[0] === 'object' ? this.options[0].label : this.options[0];
    }
  }

  this.selectLabel = function(): string {
    return this.selectedOption || (this.selected ? this.clear : this.label);
  };

  this.optionValue = (option: any | string): string => typeof option === 'object' ? JSON.stringify(option.value) : option;

  this.optionLabel = (option: any | string): string => typeof option === 'object' ? option.label : option;

  this.prepFocus = function() {
    return this.focused = false;
  };

  this.unfocus = function() {
    this.focused = this.hover || !this.focused;
    if (!this.focused) this.selectButton.blur();
  };

  this.selectOption = function(selectedOption: string, value: any): void {
    this.update({ selectedOption });
    if (this.callback) {
      try {
        this.callback(JSON.parse(value));
      } catch (e) {
        this.callback(value || '*');
      }
    }
  }

  this.selectNative = function(event: Event) {
    const option: HTMLOptionElement = <HTMLOptionElement>event.target;
    const selected = option.value;
    this.nativeSelect.options[0].disabled = !selected;
    this.update({ selected });
    this.selectOption(option.text, option.value);
  };

  this.selectCustom = function(event: MouseEvent) {
    this.selectButton.blur();
    this.selectOption(event.target['text'], event.target['value']);
  };

  this.clearSelection = function() {
    return this.selectOption(undefined, '*');
  };
}

export interface SelectConfig {
  label?: string;
  update?: Function;
  hover?: boolean;
  native?: boolean;
  clear?: string;
  default?: boolean;
  options?: any[]
}
