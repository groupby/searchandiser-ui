import { FluxTag } from '../tag';
const lArrowUrl = require('url!./arrow-left.png');
const rArrowUrl = require('url!./arrow-right.png');

export interface Pager extends FluxTag { }

export class Pager {

  prev_label: string;
  next_label: string;
  prev_icon: string;
  next_icon: string;

  init() {
    this.prev_label = this._scope.prev_label || 'Prev';
    this.next_label = this._scope.next_label || 'Next';
    this.prev_icon = this._scope.prev_icon || lArrowUrl;
    this.next_icon = this._scope.next_icon || rArrowUrl;
  }
}
