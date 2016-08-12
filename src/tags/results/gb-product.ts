import { FluxTag } from '../tag';
import { getPath, unless } from '../../utils';
import filterObject = require('filter-object');
import { ProductStructure } from '../../searchandiser';

export interface Product extends FluxTag {
  parent: FluxTag & { struct: ProductStructure, variantStruct: ProductStructure, allMeta: any };
}

export class Product {

  struct: ProductStructure;
  variantStruct: ProductStructure;
  variants: any[];
  variantIndex: number;
  allMeta: any;
  getPath: typeof getPath;
  transform: (obj: any) => any;

  init() {
    this.struct = this.parent ? this.parent.struct : this.config.structure;
    this.variantStruct = this.parent ? this.parent.variantStruct : this.config.structure;
    this.allMeta = this.parent ? this.parent.allMeta : this.opts.all_meta;
    this.transform = unless(this.struct._transform, (val) => val);
    this.getPath = getPath;
    this.on('update', this.transformRecord);
  }

  transformRecord() {
    this.allMeta = this.transform(this.allMeta);
    // set variants
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

  switchVariant(event: MouseEvent) {
    this.update({ variantIndex: (<HTMLElement>event.target).dataset['index'] });
  }

  variant(index: number) {
    /*
    Example:
    ({x: 3, y: 4, h: 8}, {z: 'x', i: 'h'}) -> {z: 3, i: 8}

    N.B. It removes keys that do not appear in the mapping
    */
    const remapWithValuesAsKeys = (x: any, mapping: any) => {
      return Object.keys(mapping).reduce((acc, key) => {
        const value = getPath(x, mapping[key]);
        if (value) {
          return Object.assign(acc, { [key]: value });
        } else {
          return acc;
        }
      }, {});
    };

    const isVariantsConfigured = this.struct.variants !== undefined;
    if (isVariantsConfigured) {
      const variantsArray: any[] = this.get(this.struct.variants);
      if (variantsArray) {
        const variant = variantsArray[index];
        if (variant) {
          return filterObject(Object.assign(remapWithValuesAsKeys(this.allMeta, this.struct), remapWithValuesAsKeys(variant, this.variantStruct || this.struct)),
            ['*', '!variants']);
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
        return filterObject(remapWithValuesAsKeys(this.allMeta, this.struct), ['*', '!variants']);
      }
      else {
        return null;
      }
    }
  }
}
