import { PageSize } from '../../src/tags/page-size/gb-page-size';
import { clearOption, label, selectOptions } from '../utils/select';
import suite from './_suite';
import { expect } from 'chai';

suite<PageSize>('gb-page-size', ({ flux, html, mount }) => {
  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html().querySelector('gb-select')).to.be.ok;
  });

  it('renders from pageSizes', () => {
    mount();

    expect(html().querySelector('gb-option-list')).to.be.ok;
    expect(label().textContent).to.eq('10');
    expect(selectOptions()).to.have.length(4);
    expect(selectOptions()[2].textContent).to.eq('50');
  });

  it('should resize on option selected', (done) => {
    mount();

    flux().resize = (value): any => {
      expect(value).to.eq(25);
      expect(clearOption()).to.not.be.ok;
      done();
    };

    selectOptions()[1].click();
  });
});
