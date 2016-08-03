import { FluxCapacitor, Events, Results } from 'groupby-api';
import { expect } from 'chai';
import { mockFlux } from '../fixtures';
import { selectOptions, clearOption, label } from '../utils/raw-select';
import { Filter } from '../../src/tags/filter/gb-filter';
import '../../src/tags/filter/gb-raw-filter.tag';

const TAG = 'gb-raw-filter';

describe('gb-raw-filter tag', () => {
  let html: Element;
  let flux: FluxCapacitor;
  beforeEach(() => {
    flux = new FluxCapacitor('');
    document.body.appendChild(html = document.createElement(TAG));
  });
  afterEach(() => document.body.removeChild(html));

  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html.querySelector('gb-raw-select')).to.be.ok;
  });

  describe('rendering behaviour', () => {
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
      tag.updateValues(<Results & any>{ availableNavigation: [navigation] });

      expect(html.querySelector('.gb-select__content')).to.be.ok;
      expect(label().textContent).to.eq('Filter');
      expect(selectOptions().length).to.eq(1);
    });

    it('shows clear option', () => {
      const tag = mount();
      tag.isTargetNav = () => true;

      flux.refine = () => null;

      expect(clearOption()).to.not.be.ok;
      tag.updateValues(<Results & any>{ availableNavigation: [navigation] });
      selectOptions()[0].click();
      expect(clearOption()).to.be.ok;
    });

    it('navigates on clear selection', (done) => {
      const tag = mount();
      tag.isTargetNav = () => true;

      flux.refine = () => null;
      flux.reset = () => done();
      flux.results = <Results & any>{ availableNavigation: [navigation] };
      flux.unrefine = (selected): any => expect(selected).to.eq(tag.selected);

      tag.updateValues(flux.results);
      selectOptions()[0].click();
      clearOption().click();
    });
  });

  function mount() {
    return <Filter>riot.mount(TAG, { flux, clone: () => flux })[0];
  }
});
