import { Results } from '../../src/tags/results/gb-results';
import suite, { BaseModel } from './_suite';
import { expect } from 'chai';

const STRUCT = { title: 'title' };

suite<Results>('gb-results', { config: { structure: STRUCT } }, ({ html, mount, itMountsTag }) => {

  itMountsTag();

  describe('render', () => {
    it('should render as list', () => {
      mount();

      expect(html().querySelector('gb-list')).to.be.ok;
    });
  });

  describe('render with records', () => {
    it('should render each record', () => {
      const tag = mount();
      const model = new Model(tag);

      tag.updateRecords(<any>{ records: [{}, {}, {}] });

      expect(model.products).to.have.length(3);
      expect(html().querySelectorAll('gb-list li')).to.have.length(3);
    });

    it('should render product info', () => {
      const title = 'Red Sneakers';
      const tag = mount();
      const model = new Model(tag);

      tag.updateRecords(<any>{ records: [{ allMeta: { title } }] });

      expect(model.productTitle(model.products[0]).textContent).to.eq(title);
    });
  });
});

class Model extends BaseModel<Results> {

  get products() {
    return this.list(this.html, 'gb-product');
  }

  productTitle(product: HTMLElement) {
    return this.element(product, '.gb-product__title');
  }
}
