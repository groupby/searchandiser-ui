import { checkBooleanAttr, scopeCss } from '../../utils/common';
import { FluxTag } from '../tag';

export interface Toggleable {
  height?: number;
  switchHeight?: number;
  animationSpeed?: number;
  checked?: boolean;
  trigger?: Function;
}

export interface Toggle extends FluxTag<any> {
  $toggleable: Toggleable;
  refs: {
    input: HTMLInputElement;
  };
}

export class Toggle {
  height: number;
  switchHeight: number;
  animationSpeed: number;
  checked: boolean;

  init() {
    const toggleable = this.toggleable();
    this.height = toggleable.height || 30;
    this.switchHeight = toggleable.switchHeight || 22;
    this.animationSpeed = toggleable.animationSpeed || 0.4;
    this.checked = checkBooleanAttr('checked', toggleable);

    this.addStyleTag();

    this.on('mount', this.onMount);
  }

  toggleable() {
    return Object.assign({}, this.$toggleable, this.opts);
  }

  onMount() {
    this.refs.input.checked = this.checked;
  }

  onClick() {
    const toggleable = this.toggleable();
    if (toggleable.trigger) {
      toggleable.trigger(this.refs.input.checked);
    }
  }

  calculateSwitchHeight(toggleHeight: number) {
    const heightDifference = toggleHeight - this.switchHeight;
    const switchHeight = Math.min(this.switchHeight, toggleHeight);
    return switchHeight - heightDifference % 2;
  }

  addStyleTag() {
    const switchHeight = this.calculateSwitchHeight(this.height);
    const padding = (this.height - switchHeight) / 2;
    const speed = this.animationSpeed;
    const node = document.createElement('style');
    node.textContent = `
      ${scopeCss('gb-toggle', 'label')} {
        height: ${this.height}px;
        width: ${this.height * 2}px;
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
