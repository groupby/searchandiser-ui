import { Filter } from '../../src/tags/filter/gb-filter';
import suite, { SelectModel } from './_suite';
import { expect } from 'chai';

suite<Filter>('gb-filter', ({
  flux, html, mount, stub,
  itMountsTag
}) => {

  itMountsTag();

  describe('render', () => {
    it('renders as select', () => {
      const tag = mount();

      expect(tag.root.querySelector('gb-select')).to.be.ok;
    });
  });

  describe('render with navigation', () => {
    const NAVIGATION = {
      name: 'brand',
      refinements: [{ type: 'Value', value: 'DeWalt' }]
    };
    let tag: Filter;
    let model: Model;

    beforeEach(() => {
      tag = mount();
      model = new Model(tag);
      tag.services.filter = <any>{ isTargetNav: () => true };
      tag.updateValues(<any>{ availableNavigation: [NAVIGATION] });
    });

    it('should render options', () => {
      expect(html().querySelector('gb-option-list')).to.be.ok;
      expect(model.label.textContent).to.eq('Filter');
      expect(model.options).to.have.length(1);
      expect(model.options[0].textContent).to.eq('DeWalt');
    });

    describe('clear option', () => {
      it('should not render clear option', () => {
        expect(model.clearOption).to.not.be.ok;
      });

      it('should render clear option when selected', () => {
        model.options[0].click();

        expect(model.clearOption.textContent).to.eq('Unfiltered');
      });

      it('should call flux.unrefine() on click', (done) => {
        const unrefine = stub(flux(), 'unrefine');
        const refine = stub(flux(), 'refine');
        flux().results = <any>{ availableNavigation: [NAVIGATION] };
        flux().reset = (): any => {
          expect(refine).to.have.been.called;
          expect(unrefine).to.have.been.calledWith(tag.selected);
          done();
        };
        model.options[0].click();

        model.clearOption.click();
      });
    });
  });
});

class Model extends SelectModel<Filter> { }
