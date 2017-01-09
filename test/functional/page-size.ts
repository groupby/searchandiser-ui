import { PageSize } from '../../src/tags/page-size/gb-page-size';
import suite, { SelectModel } from './_suite';
import { expect } from 'chai';

suite.only<PageSize>('gb-page-size', ({ flux, html, mount, itMountsTag }) => {

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
      expect(model.options).to.have.length(4);
      expect(model.options[2].textContent).to.eq('50');
    });
  });

  describe('render with page sizes', () => {
    const PAGE_SIZES = [12, 24, 40];
    let tag: PageSize;
    let model: Model;

    beforeEach(() => {
      tag = mount();
      model = new Model(tag);
    });

    it.skip('should render from configured page sizes', () => {
      // doesn't pass (incorrectly sets up config)
      tag.config = { pageSizes: PAGE_SIZES };
      tag.init();

      expect(html().querySelector('gb-option-list')).to.be.ok;
      expect(model.label.textContent).to.eq('12');
      expect(model.options).to.have.length(3);
      expect(model.options[2].textContent).to.eq('40');
    });

    it('should resize on option selected', (done) => {
      flux().resize = (value): any => {
        expect(value).to.eq(25);
        expect(model.clearOption).to.not.be.ok;
        done();
      };

      model.options[1].click();
    });
  });
});

class Model extends SelectModel<PageSize> {

  get optionList() {
    return this.element(this.html, 'gb-list');
  }
}
