import { FluxTag } from '../tag';
import { getPath } from '../../utils';

export interface Product extends FluxTag {
  parent: FluxTag & { struct: any, allMeta: any };
}

export class Product {

  struct: any;
  allMeta: any;
  getPath: typeof getPath;

  init() {
    this.struct = this.parent ? this.parent.struct : this.config.structure;
    this.allMeta = this.opts.all_meta ? this.opts.all_meta : this.parent.allMeta;
    this.getPath = getPath;
  }

  link() {
    return this.get(this.struct.url) || `details.html?id=${this.allMeta.id}`;
  }

  get(path: string) {
    return getPath(this.allMeta, path);
  }

  image(imageObj: string | string[]) {
    return Array.isArray(imageObj) ? imageObj[0] : imageObj;
  }
}
