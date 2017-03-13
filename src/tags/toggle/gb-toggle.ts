import { scopeCss } from '../../utils/common';
import { FluxTag } from '../tag';

export interface Toggleable {
  height?: number;
  switchHeight?: number;
  animationSpeed?: number;
  checked?: boolean;
  onToggle?: Function;
}

export const DEFAULTS = {
  height: 30,
  switchHeight: 22,
  animationSpeed: 0.4
};
export const TYPES = {
  checked: 'boolean'
};

export interface ToggleTag<T extends Toggleable> extends Toggleable { }

export class ToggleTag<T extends Toggleable> extends FluxTag<T> { }

export class Toggle extends FluxTag<any> {
  $toggleable: Toggleable;
  refs: {
    input: HTMLInputElement;
  };

  init() {
    this.inherits('toggleable', { defaults: DEFAULTS, types: TYPES });

    this.on('before-mount', this.addStyleTag);
    this.on('mount', this.onMount);
  }

  onMount() {
    this.refs.input.checked = this.$toggleable.checked;
  }

  onClick() {
    if (this.$toggleable.onToggle) {
      this.$toggleable.onToggle(this.refs.input.checked);
    }
  }

  calculateSwitchHeight(toggleHeight: number) {
    const heightDifference = toggleHeight - this.$toggleable.switchHeight;
    const switchHeight = Math.min(this.$toggleable.switchHeight, toggleHeight);
    return switchHeight - heightDifference % 2;
  }

  addStyleTag() {
    const switchHeight = this.calculateSwitchHeight(this.$toggleable.height);
    const padding = (this.$toggleable.height - switchHeight) / 2;
    const speed = this.$toggleable.animationSpeed;
    const node = document.createElement('style');
    node.textContent = `
      ${scopeCss('gb-toggle', 'label')} {
        height: ${this.$toggleable.height}px;
        width: ${this.$toggleable.height * 2}px;
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
