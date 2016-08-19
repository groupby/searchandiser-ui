import { FluxTag } from '../tag';
import { unless } from '../../utils';

export interface Carousel extends FluxTag { }

export class Carousel {

  currentIndex: number;
  options: any[];

  init() {
    this.currentIndex = 0;
    this.options = unless(this.opts.options, this._scope.options, []);
  }

  isSelected(index) {
    return this.currentIndex === index;
  }

  next() {
    this.update({ currentIndex: Math.min(this.currentIndex + 1, this.options.length - 1) });
  }

  prev() {
    this.update({ currentIndex: Math.max(this.currentIndex - 1, 0) });
  }

}
