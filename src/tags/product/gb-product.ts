import { checkBooleanAttr } from '../../utils/common';
import { ProductMeta, ProductStructure, ProductTransformer } from '../../utils/product-transformer';
import { FluxTag } from '../tag';
import * as clone from 'clone';
import oget = require('oget');

export interface Productable {
  lazy?: boolean;
  infinite?: boolean;
  tombstone?: boolean;
  structure?: ProductStructure;
  allMeta: any;
}

export class Product extends FluxTag<any> {
  $productable: Productable;

  lazy: boolean;
  infinite: boolean;
  tombstone: boolean;

  variantIndex: number;
  variants: any[];
  detailsUrl: string;
  allMeta: any;
  structure: any;
  productMeta: ProductMeta;
  transformer: ProductTransformer;

  init() {
    const productable = this.productable();
    this.lazy = checkBooleanAttr('lazy', productable, true);
    this.infinite = checkBooleanAttr('infinite', productable);
    this.tombstone = checkBooleanAttr('tombstone', productable);

    this.variantIndex = 0;
    this.detailsUrl = oget(this.services, 'url.urlConfig.detailsUrl', 'details.html');
    this.structure = Object.assign({}, this.config.structure, productable.structure);
    this.transformer = new ProductTransformer(this.structure);

    this.styleProduct();
    this.transformRecord(productable.allMeta);

    this.on('update', this.updateAllMeta);
  }

  productable(obj: any = {}) {
    return Object.assign(obj, this.$productable, this.opts);
  }

  updateAllMeta() {
    this.allMeta = this.productable().allMeta;
  }

  styleProduct() {
    if (this.infinite) {
      this.root.classList.add('gb-infinite');
    }
    if (this.tombstone) {
      this.root.classList.add('tombstone');
    }
  }

  transformRecord(allMeta: any = {}) {
    const productMeta = this.transformer.transform(clone(allMeta, false));
    this.update({
      productMeta: () => productMeta(this.variantIndex),
      variants: productMeta.variants || [],
      allMeta: productMeta.transformedMeta
    });
  }

  link() {
    return this.productMeta().url || `${this.detailsUrl}?id=${this.productMeta().id}`;
  }

  image(imageObj: string | string[]) {
    return Array.isArray(imageObj) ? imageObj[0] : imageObj;
  }

  switchVariant({ target }: { target: HTMLElement }) {
    const variantIndex = target.dataset['index'];
    this.update({ variantIndex });
  }
}
