import { getPath, remap } from './common';
import filterObject = require('filter-object');

export interface BaseStructure {
  variants?: string;
  _variantStructure?: any;
  _transform?: (allMeta: any) => any;
}

export interface ProductMeta {
  (variant?: number): any;
}

export type ProductStructure = BaseStructure & any;

export class ProductTransformer {

  variantStruct: any;
  productTransform: (allMeta: any) => any;
  variants: any[];

  constructor(private struct: ProductStructure) {
    this.productTransform = this.defaultTransform;
    if (typeof struct._transform === 'function') this.productTransform = struct._transform;
    this.variantStruct = this.struct._variantStructure || this.struct;
  }

  transform(allMeta: any): ProductMeta {
    const transformedMeta = this.productTransform(allMeta);
    const variants = [transformedMeta];
    // const variants = this.unpackVariants(transformedMeta);
    return (variant: number = 0) => {
      if (variant >= variants.length) {
        throw new Error(`cannot access the variant at index ${variant}`);
      }
      return variants[variant];
    };
  }

  unpackVariants(allMeta: any): any[] {
    const variants = [];
    for (let i = 0, variant; variant = this.variant(allMeta, i); ++i) {
      variants.push(variant);
    }

    return variants;
  }

  initVariants(allMeta: any) {
    this.variants = [];
    for (let i = 0, variant; variant = this.variant(allMeta, i); ++i) {
      this.variants.push(variant);
    }
  }

  variant(allMeta: any, index: number) {
    // remove non-field mapping properties
    const struct = filterObject(this.struct, '!_*');

    const isVariantsConfigured = (struct && struct.variants) !== undefined;
    if (isVariantsConfigured) {
      const variantsArray: any[] = getPath(allMeta, struct.variants);
      if (variantsArray) {
        const variant = variantsArray[index];
        if (variant) {
          const remappedBase = remap(allMeta, struct);
          const remappedVariant = remap(variant, this.variantStruct);
          return filterObject(Object.assign(remappedBase, remappedVariant), '!variants');
        }
      }
    } else if (index === 0) {
      return filterObject(remap(allMeta, struct), '!variants');
    }
    return null;
  }

  private defaultTransform(allMeta: any) {
    return allMeta;
  }
}
