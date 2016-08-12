import { FluxCapacitor, Events, Results } from 'groupby-api';
import { expect } from 'chai';
import { getPath, unless } from '../../src/utils';
import { mixinFlux, createTag, removeTag } from '../utils/tags';
import { selectOptions, label, clearOption } from '../utils/select';
import { Sort } from '../../src/tags/sort/gb-sort';
import '../../src/tags/sort/gb-sort.tag';

const TAG = 'gb-sort';

describe(`${TAG} tag`, () => {
  let html: HTMLElement;
  let flux: FluxCapacitor;

  beforeEach(() => {
    flux = mixinFlux();
    html = createTag(TAG);
  });
  afterEach(() => removeTag(html));

  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html.querySelector('gb-select')).to.be.ok;
  });

  it('renders from sorts', () => {
    const tag = mount();

    expect(html.querySelector('gb-option-list')).to.be.ok;
    expect(label().textContent).to.eq('Name Descending');
    expect(selectOptions().length).to.eq(2);
    expect(selectOptions()[1].textContent).to.eq('Name Ascending');
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
