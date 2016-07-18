import { unless } from '../../utils';

export function Select() {

  this.init = function(): void {
    const opts = this.opts.passthrough || this.opts;
    this.iconUrl = require('url!./arrow-down.png');
    this.label = opts.label || 'Select';
    this.clearOption = { label: opts.clear || 'Unselect' };
    this.options = opts.options || [];
    this.hover = unless(opts.hover, true);
    this.native = unless(opts.native, false);
    this.hasDefault = unless(opts.default, false);
    this.callback = opts.update;

    if (this.hasDefault) {
      this.selectedOption = typeof this.options[0] === 'object' ? this.options[0].label : this.options[0];
    }
  }

  this.selectLabel = function(): string {
    return this.selectedOption || (this.selected ? this.clearOption : this.label);
  };

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
    let node: Element & any = (<Element>event.target);
    while (!node['_tag'] || node.tagName !== 'GB-OPTION-WRAPPER') node = node.parentElement;
    const tag = node._tag;
    this.selectButton.blur();
    this.selectOption(tag.label, tag.value);
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
