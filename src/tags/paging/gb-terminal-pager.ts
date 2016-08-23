import { FluxTag } from '../tag';
const lDoubleArrowUrl = require('url!./double-arrow-left.png');
const rDoubleArrowUrl = require('url!./double-arrow-right.png');

export interface TerminalPager extends FluxTag { }

export class TerminalPager {

  last_label: string;
  first_label: string;
  last_icon: string;
  first_icon: string;

  init() {
    this.first_label = this._scope.first_label || 'First';
    this.last_label = this._scope.last_label || 'Last';
    this.first_icon = this._scope.first_icon || lDoubleArrowUrl;
    this.last_icon = this._scope.last_icon || rDoubleArrowUrl;
  }
}
