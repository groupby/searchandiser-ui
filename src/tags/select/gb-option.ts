import { FluxTag } from '../tag';
import { optionLabel, optionValue } from './gb-select';

export interface Option extends FluxTag { }

export class Option {
  value: string;
  label: string;

  init() {
    this.label = optionLabel(this.opts.option);
    this.value = optionValue(this.opts.option);
  }
}
