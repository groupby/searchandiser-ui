import { scopeCss } from '../../utils/common';
import { FluxTag } from '../tag';

export const DEFAULT_CONFIG: ToggleConfig = {
  height: 30,
  diameter: 22
};

export interface ToggleConfig {
  height?: number;
  diameter?: number;
}

export interface Toggle extends FluxTag<ToggleConfig> { }

export class Toggle {

  init() {
    this.configure(DEFAULT_CONFIG);

    this.addStyleTag();
  }

  addStyleTag() {
    const diameter = this._config.diameter;
    const height = this._config.height;
    const padding = (height - diameter) / 2;
    const node = document.createElement('style');
    node.textContent = `
      ${scopeCss('gb-toggle', 'label')} {
        height: ${height}px;
        width: ${height * 2}px;
      }
      ${scopeCss('gb-toggle', 'span')} {
        height: ${diameter}px;
        width: ${diameter}px;
        left: ${padding}px;
        bottom: ${padding}px;
      }

      ${scopeCss('gb-toggle', 'input:checked + div > span')} {
        transform: translateX(${diameter}px);
      }
    `;
    this.root.appendChild(node);
  }
}
