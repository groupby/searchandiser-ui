import { FluxTag } from '../tag';
import { getPath, unless } from '../../utils';
import filterObject = require('filter-object');

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

  variant(index: number) {
    const desiredFields = '{image,price,title}';
    const isVariantsConfigured = this.struct.variants !== undefined;
    if (isVariantsConfigured) {
      const variantsArray: any[] = this.get(this.struct.variants);
      if (variantsArray) {
        const variant = variantsArray[index];
        if (variant) {
          return filterObject(variantsArray[index], desiredFields);
        }
        else {
          return null;
        }
      }
      else {
        return null;
      }
    }
    else {
      if (index === 0) {
        return filterObject(this.allMeta, desiredFields);
      }
      else {
        return null;
      }
    }
  }
}
