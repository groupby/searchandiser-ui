import { SEARCH_RESET_EVENT } from '../../src/services/search';
import { Submit } from '../../src/tags/submit/gb-submit';
import suite, { BaseModel } from './_suite';

suite<Submit>('gb-submit', ({ spy, expect, flux, mount, itMountsTag }) => {

  itMountsTag();

  describe('render', () => {
    it('should render submit link', () => {
      const model = new Model(mount());

      expect(model.link).to.be.ok;
      expect(model.link.textContent).to.eq('🔍');
    });

    it('should call tag.submitQuery() on click', () => {
      const tag = mount();
      const emit = flux().emit = spy();
      tag.searchBox = <any>{};

      tag.root.click();

      expect(emit).to.be.calledWith(SEARCH_RESET_EVENT);
    });
  });
});

class Model extends BaseModel<Submit>  {
  get link() {
    return this.element(this.html, '.gb-submit');
  }
}
