import { FluxCapacitor, Events, Results } from 'groupby-api';
import { expect } from 'chai';
import { mixinFlux, createTag, removeTag } from '../utils/tags';
import { selectOptions, clearOption, label } from '../utils/select';
import { Filter } from '../../src/tags/filter/gb-filter';
import '../../src/tags/filter/gb-filter.tag';

const TAG = 'gb-filter';

describe(`${TAG} tag`, () => {
  let html: HTMLElement;
  let flux: FluxCapacitor;

  beforeEach(() => {
    flux = mixinFlux({ _clone: () => flux })
    html = createTag(TAG);
  });
  afterEach(() => removeTag(html));

  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html.querySelector('gb-select')).to.be.ok;
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
      tag.updateValues(<Results & any>{ availableNavigation: [navigation] });

      expect(html.querySelector('gb-option-list')).to.be.ok;
      expect(label().textContent).to.eq('Filter');
      expect(selectOptions().length).to.eq(1);
      expect(selectOptions()[0].textContent).to.eq('DeWalt');
    });

    it('renders clear option', () => {
      const tag = mount();
      tag.isTargetNav = () => true;

      flux.refine = () => null;

      expect(clearOption()).to.not.be.ok;
      tag.updateValues(<Results & any>{ availableNavigation: [navigation] });
      selectOptions()[0].click();
      expect(clearOption().textContent).to.eq('Unfiltered');
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

  function rawTag() {
    return <Filter>html.querySelector('gb-raw-filter')['_tag'];
  }

  function mount() {
    return <Filter>riot.mount(TAG)[0];
  }
});
