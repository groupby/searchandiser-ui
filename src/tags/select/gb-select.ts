import './gb-option-wrapper.tag';
import { FluxTag } from '../tag';
import { unless } from '../../utils';

export interface Select extends FluxTag { }

export class Select {

  iconUrl: string;
  label: string;
  clearOption: { label: string };
  options: any[];
  hover: boolean;
  native: boolean;
  hasDefault: boolean;
  callback: Function;
  selectedOption: any;
  selected: any;
  focused: boolean;
  selectButton: HTMLButtonElement;
  nativeSelect: HTMLSelectElement;

  init(): void {
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

  selectLabel(): string {
    return this.selectedOption || (this.selected ? this.clearOption : this.label);
  }

  prepFocus() {
    return this.focused = false;
  }

  unfocus() {
    this.focused = this.hover || !this.focused;
    if (!this.focused) this.selectButton.blur();
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
    const option: HTMLOptionElement = <HTMLOptionElement>event.target;
    const selected = option.value;
    this.nativeSelect.options[0].disabled = !selected;
    this.update({ selected });
    this.selectOption(option.text, option.value);
  }

  selectCustom(event: MouseEvent) {
    let node: Element & any = (<Element>event.target);
    while (!node['_tag'] || node.tagName !== 'GB-OPTION-WRAPPER') node = node.parentElement;
    const tag = node._tag;
    this.selectButton.blur();
    this.selectOption(tag.label, tag.value);
  }

  clearSelection() {
    return this.selectOption(undefined, '*');
  }
}

export function optionValue(option: any) {
  return typeof option === 'object' ? JSON.stringify(option.value) : option;
}

export function optionLabel(option: any) {
  return typeof option === 'object' ? option.label : option;
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
