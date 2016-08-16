import { FluxTag } from '../tag';
import { getPath, unless, remap } from '../../utils';
import filterObject = require('filter-object');
import { ProductStructure } from '../../searchandiser';

export interface Product extends FluxTag { }

export class Product {

  struct: ProductStructure;
  variantStruct: ProductStructure;
  variants: any[];
  variantIndex: number;
  allMeta: any;
  getPath: typeof getPath;
  transform: (obj: any) => any;

  init() {
    this.variants = [];

    this.struct = unless(this._scope.struct, this.config.structure, {});
    this.variantStruct = unless(this._scope.variantStruct, this.struct._variantStructure, this.struct);
    this.variantIndex = 0;
    this.allMeta = this.opts.all_meta;
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
    const struct = filterObject(this.struct, ['*', '!_*']);

    const isVariantsConfigured = (struct && struct.variants) !== undefined;
    if (isVariantsConfigured) {
      const variantsArray: any[] = this.get(struct.variants);
      if (variantsArray) {
        const variant = variantsArray[index];
        if (variant) {
          return filterObject(Object.assign(remap(this.allMeta, struct),
            remap(variant, this.variantStruct)),
            ['*', '!variants']);
        }
      }
    } else if (index === 0) {
      return filterObject(remap(this.allMeta, struct), ['*', '!variants']);
    }
    return null;
  }

  productMeta() {
    console.log(this.variants);
    console.log(this.variantIndex);
    return this.variants[this.variantIndex];
  }

  initVariants() {
    this.variants = [];
    let i = 0;
    let variant;
    while (variant = this.variant(i++)) {
      this.variants.push(variant);
    }
  }
}
