import { Sort } from '../../src/tags/sort/gb-sort';
import { clearOption, label, selectOptions } from '../utils/select';
import suite from './_suite';
import { expect } from 'chai';

suite<Sort>('gb-sort', ({ flux, html, mount }) => {
  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html().querySelector('gb-select')).to.be.ok;
  });

  it('renders from sorts', () => {
    mount();

    expect(html().querySelector('gb-option-list')).to.be.ok;
    expect(label().textContent).to.eq('Name Descending');
    expect(selectOptions().length).to.eq(2);
    expect(selectOptions()[1].textContent).to.eq('Name Ascending');
  });

  it('should sort on option selected', () => {
    mount();

    flux().sort = (sort): any => expect(sort).to.eql({ field: 'title', order: 'Ascending' });

    selectOptions()[1].click();
    expect(clearOption()).to.not.be.ok;
  });
});
