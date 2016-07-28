import { FluxTag } from '../tag';
import { getPath } from '../../utils';

export interface Product extends FluxTag { }

export class Product {

  parent: Riot.Tag.Instance & { struct: any };
  struct: any;
  getPath: typeof getPath;

  init() {
    this.struct = this.parent.struct;
    this.getPath = getPath;
  }

  link(id) {
    return this.struct.url || `details.html?id=${id}`;
  }

  image(imageObj: string | string[]) {
    return Array.isArray(imageObj) ? imageObj[0] : imageObj;
  }
}
