import { FluxTag } from '../tag';
import { getPath, unless } from '../../utils';

export interface Product extends FluxTag {
  parent: FluxTag & { struct: any, allMeta: any };
}

export class Product {

  struct: any;
  allMeta: any;
  getPath: typeof getPath;
  transform: (obj: any) => any;

  init() {
    this.struct = this.parent ? this.parent.struct : this.config.structure;
    this.allMeta = this.parent ? this.parent.allMeta : this.opts.all_meta;
    this.transform = unless(this.struct._transform, (val) => val);
    this.getPath = getPath;
    this.on('update', this.transformRecord);
  }

  transformRecord() {
    this.allMeta = this.transform(this.allMeta);
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
