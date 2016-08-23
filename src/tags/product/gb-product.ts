import { FluxTag } from '../tag';
import { getPath, unless, remap } from '../../utils';
import { ProductStructure } from '../../searchandiser';
import filterObject = require('filter-object');
import clone = require('clone');

export interface Product extends FluxTag { }

const DEFAULT_STRUCTURE = {
  id: 'id'
};

export class Product {

  private originalAllMeta;
  struct: ProductStructure;
  variantStruct: ProductStructure;
  variants: any[];
  variantIndex: number;
  allMeta: any;
  getPath: typeof getPath;
  transform: (obj: any) => any;

  init() {
    this.variants = [];

    this.struct = Object.assign({}, DEFAULT_STRUCTURE, unless(this._scope.struct, this.config.structure, {}));
    this.variantStruct = unless(this._scope.variantStruct, this.struct._variantStructure, this.struct);
    this.variantIndex = 0;
    this.allMeta = this.originalAllMeta = this.opts.all_meta;
    this.initVariants();
    this.transform = unless(this.struct._transform, (val) => val);

    this.getPath = getPath;
    this.on('update', this.transformRecord);
  }

  transformRecord() {
    this.allMeta = this.transform(clone(this.originalAllMeta, false));
    this.initVariants();
  }

  link() {
    return this.productMeta().url || `details.html?id=${this.productMeta().id}`;
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
    // Remove non-field mapping properties
    const struct = filterObject(this.struct, '!_*');

    const isVariantsConfigured = (struct && struct.variants) !== undefined;
    if (isVariantsConfigured) {
      const variantsArray: any[] = this.get(struct.variants);
      if (variantsArray) {
        const variant = variantsArray[index];
        if (variant) {
          return filterObject(Object.assign(remap(this.allMeta, struct),
            remap(variant, this.variantStruct)), '!variants');
        }
      }
    } else if (index === 0) {
      return filterObject(remap(this.allMeta, struct), '!variants');
    }
    return null;
  }

  productMeta() {
    return this.variants[this.variantIndex];
  }

  initVariants() {
    this.variants = [];
    for (let i = 0, variant; variant = this.variant(i); ++i) {
      this.variants.push(variant);
    }
  }
}
