import { Filter } from '../../src/tags/filter/gb-filter';
import suite, { SelectModel } from './_suite';
import { expect } from 'chai';

suite<Filter>('gb-filter', ({
  flux, html, mount,
  itMountsTag
}) => {

  itMountsTag();

  it('renders as select', () => {
    mount();

    expect(html().querySelector('gb-select')).to.be.ok;
  });

  describe('render behaviour', () => {
    const NAVIGATION = {
      name: 'brand',
      refinements: [{
        type: 'Value',
        value: 'DeWalt'
      }]
    };

    it('renders from results', () => {
      const tag = mount();
      const model = new Model(tag);
      tag.services.filter = <any>{ isTargetNav: () => true };

      tag.updateValues(<any>{ availableNavigation: [NAVIGATION] });

      expect(html().querySelector('gb-option-list')).to.be.ok;
      expect(model.label.textContent).to.eq('Filter');
      expect(model.options).to.have.length(1);
      expect(model.options[0].textContent).to.eq('DeWalt');
    });

    describe('clear option', () => {
      it('does not render clear option', () => {
        const tag = mount();
        const model = new Model(tag);
        tag.services.filter = <any>{ isTargetNav: () => true };
        flux().refine = () => null;

        expect(model.clearOption).to.not.be.ok;
      });

      it('renders clear option', () => {
        const tag = mount();
        const model = new Model(tag);
        tag.services.filter = <any>{ isTargetNav: () => true };
        flux().refine = () => null;
        tag.updateValues(<any>{ availableNavigation: [NAVIGATION] });

        model.options[0].click();

        expect(model.clearOption.textContent).to.eq('Unfiltered');
      });
    });

    it('navigates on clear selection', (done) => {
      const tag = mount();
      const model = new Model(tag);
      tag.services.filter = <any>{ isTargetNav: () => true };
      flux().refine = () => null;
      flux().reset = () => done();
      flux().results = <any>{ availableNavigation: [NAVIGATION] };
      flux().unrefine = (selected): any => expect(selected).to.eq(tag.selected);
      tag.updateValues(flux().results);

      model.options[0].click();

      model.clearOption.click();
    });
  });
});

class Model extends SelectModel<Filter> {

}
