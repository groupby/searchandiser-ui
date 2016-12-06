import { scopeCss } from '../../utils/common';
import { FluxTag } from '../tag';

export const DEFAULT_CONFIG: ToggleConfig = {
  radius: 13
};

export interface ToggleConfig {
  radius?: number;
}

export interface Toggle extends FluxTag<ToggleConfig> { }

export class Toggle {

  init() {
    this.configure(DEFAULT_CONFIG);

    this.addStyleTag();
  }

  addStyleTag() {
    const diameter = this._config.radius * 2;
    const node = document.createElement('style');
    node.textContent = `
      ${scopeCss('gb-toggle', 'span')} {
        height: ${diameter}px;
        width: ${diameter}px;
      }

      ${scopeCss('gb-toggle', 'input:checked + div > span')} {
        transform: translateX(${diameter}px);
      }
    `;
    this.root.appendChild(node);
  }
}
