import { FluxTag } from '../tag';
import { SelectConfig } from '../select/gb-select';

export interface PageSize extends FluxTag { }

export class PageSize {

  parentOpts: any;
  passthrough: SelectConfig;

  init() {
    this.parentOpts = this.opts.passthrough || this.opts;
    this.passthrough = Object.assign({}, this.parentOpts.__proto__, {
      options: this.parentOpts.config.pageSizes || [10, 25, 50, 100],
      hover: this.parentOpts.onHover,
      update: this.resize,
      default: true
    });
  }

  resize(value) {
    return this.flux.resize(value, this.parentOpts.resetOffset ? 0 : undefined);
  }
}
