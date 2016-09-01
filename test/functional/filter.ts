import { Filter } from '../../src/tags/filter/gb-filter';
import { clearOption, label, selectOptions } from '../utils/select';
import suite from './_suite';
import { expect } from 'chai';

suite<Filter>('gb-filter', ({ flux, html, mount }) => {
  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html().querySelector('gb-select')).to.be.ok;
  });

  describe('render behaviour', () => {
    const navigation = {
      name: 'brand',
      refinements: [{
        type: 'Value',
        value: 'DeWalt'
      }]
    };

    it('renders from results', () => {
      const tag = mount();

      tag.isTargetNav = () => true;
      tag.updateValues(<any>{ availableNavigation: [navigation] });

      expect(html().querySelector('gb-option-list')).to.be.ok;
      expect(label().textContent).to.eq('Filter');
      expect(selectOptions().length).to.eq(1);
      expect(selectOptions()[0].textContent).to.eq('DeWalt');
    });

    it('renders clear option', () => {
      const tag = mount();
      tag.isTargetNav = () => true;

      flux().refine = () => null;

      expect(clearOption()).to.not.be.ok;
      tag.updateValues(<any>{ availableNavigation: [navigation] });
      selectOptions()[0].click();
      expect(clearOption().textContent).to.eq('Unfiltered');
    });

    it('navigates on clear selection', (done) => {
      const tag = mount();
      tag.isTargetNav = () => true;

      flux().refine = () => null;
      flux().reset = () => done();
      flux().results = <any>{ availableNavigation: [navigation] };
      flux().unrefine = (selected): any => expect(selected).to.eq(tag.selected);

      tag.updateValues(flux().results);
      selectOptions()[0].click();
      clearOption().click();
    });
  });
});
