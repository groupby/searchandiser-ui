import { scopeCss } from '../../utils/common';
import { FluxTag } from '../tag';

export const DEFAULT_CONFIG: ToggleConfig = {
  height: 30,
  diameter: 22,
  animationSpeed: 0.4
};

export interface ToggleConfig {
  height?: number;
  diameter?: number;
  animationSpeed?: number;
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
    const speed = this._config.animationSpeed;
    const node = document.createElement('style');
    node.textContent = `
      ${scopeCss('gb-toggle', 'label')} {
        height: ${height}px;
        width: ${height * 2}px;
      }

      ${scopeCss('gb-toggle', 'div')} {
        transition: ${speed}s;
      }

      ${scopeCss('gb-toggle', 'span')} {
        height: ${diameter}px;
        width: ${diameter}px;
        left: ${padding}px;
        bottom: ${padding}px;
        transition: ${speed}s;
      }

      ${scopeCss('gb-toggle', 'input:checked + div > span')} {
        transform: translateX(${diameter + padding * 2}px);
      }
    `;
    this.root.appendChild(node);
  }
}
