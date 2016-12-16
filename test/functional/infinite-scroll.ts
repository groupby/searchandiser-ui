import { InfiniteScroll } from '../../src/tags/infinite-scroll/gb-infinite-scroll';
import suite, { BaseModel } from './_suite';
import { expect } from 'chai';
import * as riot from 'riot';

const MIXIN = { _scope: { on: () => null } };

suite.only<InfiniteScroll>('gb-infinite-scroll', MIXIN, ({
  flux, mount, spy, stub,
  itMountsTag
}) => {

  itMountsTag();

  describe('render', () => {
    it('should render scroller and runway', () => {
      const model = new Model(mount());

      expect(model.scroller).to.be.ok;
      expect(model.runway).to.be.ok;
    });

    it('should render products', (done) => {
      const tag = mount();
      const model = new Model(tag);
      tag.fetch = (): any => {
        expect(model.products).to.have.length(50);
        done();
      };
    });
  });

  describe('render products', () => {
    it('should render product image and info', (done) => {
      const tag = mount();

      const model = new Model(tag);
      tag.fetch = (): any => {
        const product = model.products[0];
        expect(model.productImage(product)).to.be.ok;
        expect(model.productInfo(product)).to.be.ok;
        expect(model.variantSwitcher(product)).to.be.ok;
        done();
      };
    });

    it('should set details url', (done) => {
      let tag: InfiniteScroll;
      let model: Model;
      flux().bridge = <any>{
        search: () => {
          tag.maybeRequestContent = (): any => {
            console.log(model.products.length);
            const product = model.products[model.products.length - 1];
            expect(model.imageLink(product).href).to.eq('http://localhost:9876/details.html?id=1234');
            // expect(model.productInfo(product)).to.be.ok;
            done();
          };
          return Promise.resolve([{ allMeta: { a: 'b', id: 1234 } }, { allMeta: { a: 'b', id: 1234 } }]);
        }
      };
      tag = mount();
      model = new Model(tag);
    });
  });
});

class Model extends BaseModel<InfiniteScroll> {

  get scroller() {
    return this.element(this.html, '#scroller');
  }

  get runway() {
    return this.element(this.html, '#runway');
  }

  get products() {
    return this.list<riot.TagElement>(this.html, 'li.gb-infinite');
  }

  productImage(parent: HTMLElement = this.html) {
    return this.element(parent, 'gb-product-image');
  }

  imageLink(parent: HTMLElement = this.html) {
    return this.element<HTMLAnchorElement>(this.productImage(parent), 'a');
  }

  productInfo(parent: HTMLElement = this.html) {
    return this.element(parent, 'gb-product-info');
  }

  variantSwitcher(parent: HTMLElement = this.html) {
    return this.element(parent, 'gb-variant-switcher');
  }
}
