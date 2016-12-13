import { scopeCss } from '../../utils/common';
import { FluxTag } from '../tag';
import { Toggle, ToggleConfig } from '../toggle/gb-toggle';

export const DEFAULT_CONFIG: GridToggleConfig = [
  { label: '4', column: 4 },
  { label: '5', column: 5 }
];

export interface GridToggleConfig extends ToggleConfig {
  options: any[];
}

export interface GridToggle extends FluxTag<GridToggleConfig> { }

export class GridToggle {

  input: HTMLInputElement;

  init() {
    this.configure();

    this.options = this._config.options || DEFAULT_CONFIG;
  }
}
