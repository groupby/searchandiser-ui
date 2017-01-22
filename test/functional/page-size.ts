import { PageSize } from '../../src/tags/page-size/gb-page-size';
import suite, { SelectModel } from './_suite';
import { expect } from 'chai';

suite<PageSize>('gb-page-size', ({ flux, html, mount, itMountsTag }) => {

  itMountsTag();

  describe('render', () => {
    it('should render as select', () => {
      mount();

      expect(html().querySelector('gb-select')).to.be.ok;
    });

    it('should render default page sizes', () => {
      const model = new Model(mount());

      expect(model.optionList).to.be.ok;
      expect(model.label.textContent).to.eq('10');
      expect(model.items).to.have.length(4);
      expect(model.items[2].textContent).to.eq('50');
    });
  });

  describe('select page size', () => {
    it('should resize on option selected', (done) => {
      const model = new Model(mount());

      flux().resize = (value): any => {
        expect(value).to.eq(25);
        expect(model.clearItem).to.not.be.ok;
        done();
      };

      model.items[1].click();
    });
  });
});

class Model extends SelectModel {

  get optionList() {
    return this.element(this.html, 'gb-list');
  }
}
