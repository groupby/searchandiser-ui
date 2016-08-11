import { FluxCapacitor, Events, Results } from 'groupby-api';
import { expect } from 'chai';
import { mixinFlux, createTag, removeTag } from '../utils/tags';
import { selectOptions, clearOption, label } from '../utils/raw-select';
import { Sort } from '../../src/tags/sort/gb-sort';
import '../../src/tags/sort/gb-raw-sort.tag';

const TAG = 'gb-raw-sort';

describe(`${TAG} tag`, () => {
  let html: HTMLElement,
    flux: FluxCapacitor;

  beforeEach(() => {
    flux = mixinFlux();
    html = createTag(TAG);
  });
  afterEach(() => removeTag(html));

  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html.querySelector('gb-raw-select')).to.be.ok;
  });

  it('renders from sorts', () => {
    const tag = mount();

    expect(html.querySelector('.gb-select__content')).to.be.ok;
    expect(label().textContent).to.eq('Name Descending');
    expect(selectOptions().length).to.eq(2);
  });

  it('should sort on option selected', () => {
    const tag = mount();

    flux.sort = (sort): any => expect(sort).to.eql({ field: 'title', order: 'Ascending' });

    selectOptions()[1].click();
    expect(clearOption()).to.not.be.ok;
  });

  function mount() {
    return <Sort>riot.mount(TAG)[0];
  }
});
