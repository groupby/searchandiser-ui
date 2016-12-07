import { scopeCss } from '../../utils/common';
import { FluxTag } from '../tag';

export const DEFAULT_CONFIG: ToggleConfig = {
  height: 30,
  switchHeight: 22,
  animationSpeed: 0.4,
  checked: false
};

export interface ToggleConfig {
  height?: number;
  switchHeight?: number;
  animationSpeed?: number;
  checked?: boolean;
}

export interface Toggle extends FluxTag<ToggleConfig> { }

export class Toggle {

  input: HTMLInputElement;

  init() {
    this.configure(DEFAULT_CONFIG);

    this.input.checked = this._config.checked;

    this.addStyleTag();
  }

  onClick() {
    if (this.opts.trigger) {
      this.opts.trigger(this.input.checked);
    }
  }

  calculateSwitchHeight(height: number) {
    const heightDiff = height - this._config.switchHeight;
    const switchHeight = Math.min(this._config.switchHeight, height);
    return switchHeight - heightDiff % 2;
  }

  addStyleTag() {
    const height = this._config.height;
    const switchHeight = this.calculateSwitchHeight(height);
    const padding = (height - switchHeight) / 2;
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
        height: ${switchHeight}px;
        width: ${switchHeight}px;
        left: ${padding}px;
        bottom: ${padding}px;
        transition: ${speed}s;
      }

      ${scopeCss('gb-toggle', 'input:checked + div > span')} {
        transform: translateX(${switchHeight + padding * 2}px);
      }
    `;
    this.root.appendChild(node);
  }
}
