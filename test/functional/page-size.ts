import { PageSize } from '../../src/tags/page-size/gb-page-size';
import suite, { SelectModel } from './_suite';
import { expect } from 'chai';

suite<PageSize>('gb-page-size', ({ flux, html, mount, itMountsTag }) => {

  itMountsTag();

  it('renders as select', () => {
    mount();

    expect(html().querySelector('gb-select')).to.be.ok;
  });

  it('renders from pageSizes', () => {
    const model = new Model(mount());

    expect(html().querySelector('gb-option-list')).to.be.ok;
    expect(model.label.textContent).to.eq('10');
    expect(model.options).to.have.length(4);
    expect(model.options[2].textContent).to.eq('50');
  });

  it('should resize on option selected', (done) => {
    const model = new Model(mount());
    flux().resize = (value): any => {
      expect(value).to.eq(25);
      expect(model.clearOption).to.not.be.ok;
      done();
    };

    model.options[1].click();
  });
});

class Model extends SelectModel<PageSize> {

}
