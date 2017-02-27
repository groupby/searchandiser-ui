import { getPath, remap } from './common';
import filterObject = require('filter-object');

const DEFAULT_STRUCTURE = {
  id: 'id'
};

export interface BaseStructure {
  title: string;
  price: string;
  id?: string;
  url?: string;
  variants?: string;
  _variantStructure?: {
    _transform?: (variantMeta: any, allMeta: any) => any;
  };
  _transform?: (allMeta: any) => any;
}

export interface ProductMeta {
  (variant?: number): any;
  variants?: any[];
  transformedMeta?: any;
}

export type ProductStructure = BaseStructure & any;

export class ProductTransformer {

  structure: ProductStructure;
  variantStructure: any;
  hasVariants: boolean;
  idField: string;
  productTransform: (allMeta: any) => any;
  variantTransform: (variantMeta: any, allMeta: any) => any;
  variants: any[];

  constructor(structure: ProductStructure) {
    this.structure = Object.assign({}, DEFAULT_STRUCTURE, structure);
    this.productTransform = ProductTransformer.getTransform(this.structure);
    this.hasVariants = 'variants' in structure;
    this.variantStructure = this.structure._variantStructure || this.structure;
    this.variantTransform = ProductTransformer.getTransform(this.variantStructure);
    this.idField = this.extractIdField();
  }

  transform(allMeta: any) {
    if (allMeta) {
      const transformedMeta = this.productTransform(allMeta);
      return this.unpackVariants(transformedMeta);
    } else {
      return [{}];
    }
  }

  unpackVariants(allMeta: any): any[] {
    const struct = filterObject(this.structure, '!_*');
    const variantStruct = filterObject(this.variantStructure, '!_*');
    const remappedMeta = remap(allMeta, struct);
    const variantMapping = this.remapVariant(remappedMeta, variantStruct);

    if (this.hasVariants && Array.isArray(getPath(allMeta, struct.variants))) {
      const variantsArray: any[] = getPath(allMeta, struct.variants)
        .filter((variant) => variant);
      if (variantsArray.length > 0) {
        return variantsArray.map(variantMapping);
      }
    }
    return [filterObject(remappedMeta, '!variants')];
  }

  remapVariant(remappedMeta: any, variantStruct: any) {
    return (variant) => {
      let remappedVariant = remap(variant, variantStruct);
      if (this.productTransform !== this.variantTransform) {
        remappedVariant = this.variantTransform(remappedVariant, remappedMeta);
      }
      return filterObject(Object.assign({}, remappedMeta, remappedVariant), '!variants');
    };
  }

  extractIdField() {
    // ensure we actually want the nested id
    if (this.hasVariants && this.structure._variantStructure && this.variantStructure.id) {
      return `${this.structure.variants}.${this.variantStructure.id}`;
    } else {
      return this.structure.id;
    }
  }

  static getTransform(structure: ProductStructure) {
    if (typeof structure._transform === 'function') {
      return structure._transform;
    } else {
      return (meta) => meta;
    }
  }
}
