import { FluxTag } from '../tag';

export interface PageSize extends FluxTag { }

export class PageSize {

  passthrough: PageSizePassthrough;

  init() {
    const parentOpts = this.opts.passthrough || this.opts;
    this.passthrough = Object.assign({}, parentOpts.__proto__, {
      options: parentOpts.config.pageSizes || [10, 25, 50, 100],
      hover: parentOpts.onHover,
      update: (value) => parentOpts.flux.resize(value, parentOpts.resetOffset ? 0 : undefined),
      default: true
    });
  }
}

export interface PageSizePassthrough {
  options: number[];
  hover: boolean;
  update: (number) => void;
  default: boolean;
}
