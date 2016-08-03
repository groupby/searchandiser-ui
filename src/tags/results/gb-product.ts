import { FluxTag } from '../tag';
import { getPath, unless } from '../../utils';

export interface Product extends FluxTag { }

export class Product {

  parent: Riot.Tag.Instance & { struct: any };
  struct: any;
  getPath: typeof getPath;

  init() {
    this.struct = this.parent.struct;
    this.getPath = getPath;
  }

  link(allMeta: any) {
    return unless(getPath(allMeta, this.struct.url), `details.html?id=${allMeta.id}`);
  }

  image(imageObj: string | string[]) {
    return Array.isArray(imageObj) ? imageObj[0] : imageObj;
  }
}
