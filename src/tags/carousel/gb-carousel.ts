import { FluxTag } from '../tag';

export interface CarouselOpts {
  items: any[];
}

export class Carousel extends FluxTag<CarouselOpts> {

  currentIndex: number;
  items: any[];

  init() {
    this.expose('listable');

    this.currentIndex = 0;
    this.items = this.opts.items || [];
  }

  isSelected(index: number) {
    return this.currentIndex === index;
  }

  next() {
    this.update({ currentIndex: Math.min(this.currentIndex + 1, this.items.length - 1) });
  }

  prev() {
    this.update({ currentIndex: Math.max(this.currentIndex - 1, 0) });
  }
}
