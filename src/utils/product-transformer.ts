import { getPath, remap } from './common';
import filterObject = require('filter-object');

const DEFAULT_STRUCTURE = {
  id: 'id'
};

export interface BaseStructure {
  variants?: string;
  _variantStructure?: any;
  _transform?: (allMeta: any) => any;
}

export interface ProductMeta {
  (variant?: number): any;
  variants?: any[];
  transformedMeta?: any;
}

export type ProductStructure = BaseStructure & any;

export class ProductTransformer {

  struct: ProductStructure;
  variantStruct: any;
  hasVariants: boolean;
  idField: string;
  productTransform: (allMeta: any) => any;
  variants: any[];

  constructor(struct: ProductStructure) {
    this.struct = Object.assign({}, DEFAULT_STRUCTURE, struct);
    this.setTransform();
    this.hasVariants = 'variants' in struct;
    this.variantStruct = this.struct._variantStructure || this.struct;
    this.idField = this.hasVariants
      && this.struct._variantStructure
      && `${this.struct.variants}.${this.variantStruct.id}`
      || this.struct.id;
  }

  transform(allMeta: any): ProductMeta {
    const transformedMeta = this.productTransform(allMeta);
    const variants = this.unpackVariants(transformedMeta);
    const productMeta: ProductMeta = (variant: number = 0) => {
      if (variant >= variants.length) {
        throw new Error(`cannot access the variant at index ${variant}`);
      } else {
        return variants[variant];
      }
    };
    productMeta.variants = variants;
    productMeta.transformedMeta = transformedMeta;

    return productMeta;
  }

  unpackVariants(allMeta: any): any[] {
    const struct = filterObject(this.struct, '!_*');
    const variantStruct = filterObject(this.variantStruct, '!_*');
    const remappedMeta = remap(allMeta, struct);

    if (this.hasVariants && Array.isArray(getPath(allMeta, struct.variants))) {
      const variantsArray: any[] = getPath(allMeta, struct.variants)
        .filter((variant) => variant);
      if (variantsArray.length > 0) {
        return variantsArray.map(this.remapVariant(remappedMeta, variantStruct));
      }
    }
    return [filterObject(remappedMeta, '!variants')];
  }

  remapVariant(remappedMeta: any, variantStruct: any) {
    return (variant) => {
      const remappedVariant = remap(variant, variantStruct);
      return filterObject(Object.assign(remappedMeta, remappedVariant), '!variants');
    };
  }

  private setTransform() {
    if (typeof this.struct._transform === 'function') {
      this.productTransform = this.struct._transform;
    } else {
      this.productTransform = this.defaultTransform;
    }
  }

  private defaultTransform(allMeta: any) {
    return allMeta;
  }
}
