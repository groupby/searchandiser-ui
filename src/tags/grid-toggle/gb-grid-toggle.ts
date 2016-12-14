import { findTag } from '../../utils/common';
import { FluxTag } from '../tag';
import { ToggleConfig } from '../toggle/gb-toggle';

export const DEFAULT_CONFIG: GridToggleConfig = {};

export interface GridToggleConfig extends ToggleConfig { }

export interface GridToggle extends FluxTag<GridToggleConfig> { }

export class GridToggle {

  input: HTMLInputElement;

  init() {
    this.configure(DEFAULT_CONFIG);
  }

  onChange(checked: boolean) {
    const resultsTag = findTag('gb-results')['_tag'];
    resultsTag._config.grid = checked;
    resultsTag.update();
  }
}
