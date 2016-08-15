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
    this.struct = (this.parent ? this.parent.struct : (this.config && this.config.structure));
    this.variantStruct = (this.parent ? this.parent.variantStruct : (this.config && this.config.variantStructure)) || this.struct;
    this.variantIndex = 0;
    this.allMeta = this.parent ? this.parent.allMeta : this.opts.all_meta;
    this.initVariants();
    this.transform = unless(this.struct._transform, (val) => val);

    this.getPath = getPath;
    this.on('update', this.transformRecord);
  }

  transformRecord() {
    this.allMeta = this.transform(this.allMeta);
    this.initVariants();
  }

  link() {
    return this.currentVariant().url || `details.html?id=${this.currentVariant().id}`;
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
      if (mapping) {
        return Object.keys(mapping).reduce((acc, key) => {
          const value = getPath(x, mapping[key]);
          if (value) {
            return Object.assign(acc, { [key]: value });
          } else {
            return acc;
          }
        }, {});
      } else {
        return x;
      }
    };

    // TODO: Add a typing to filter-object that permits a callback (any => boolean)
    // Remove properties that don't refer to paths in the records
    const struct = (<any>filterObject)(this.struct || {}, (val) => (typeof val === 'string'));

    const isVariantsConfigured = (struct && struct.variants) !== undefined;
    if (isVariantsConfigured) {
      const variantsArray: any[] = this.get(struct.variants);
      if (variantsArray) {
        const variant = variantsArray[index];
        if (variant) {
          return filterObject(Object.assign(remapWithValuesAsKeys(this.allMeta, struct || {}),
            remapWithValuesAsKeys(variant, this.variantStruct || {})),
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
        return filterObject(remapWithValuesAsKeys(this.allMeta, struct || {}), ['*', '!variants']);
      }
      else {
        return null;
      }
    }
  }

  currentVariant() {
    return this.variants[this.variantIndex];
  }

  initVariants() {
    this.variants = [];
    let i = 0;
    let variant;
    while (variant = this.variant(i)) {
      this.variants.push(variant);
      ++i;
    }
  }
}
