import { FluxCapacitor, Events, Results } from 'groupby-api';
import { expect } from 'chai';
import { mixinFlux, createTag, removeTag } from '../utils/tags';
import { selectOptions, label, clearOption } from '../utils/select';
import { PageSize } from '../../src/tags/page-size/gb-page-size';
import '../../src/tags/page-size/gb-page-size.tag';

const TAG = 'gb-page-size';

describe(`${TAG} tag`, () => {
  let html: HTMLElement;
  let flux: FluxCapacitor;

  beforeEach(() => {
    flux = mixinFlux({ config: {} });
    html = createTag(TAG);
  });
  afterEach(() => removeTag(html));

  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html.querySelector('gb-select')).to.be.ok;
  });

  it('renders from pageSizes', () => {
    const tag = mount();

    expect(html.querySelector('gb-option-list')).to.be.ok;
    expect(label().textContent).to.eq('10');
    expect(selectOptions().length).to.eq(4);
    expect(selectOptions()[2].textContent).to.eq('50');
  });

  it('should resize on option selected', () => {
    const tag = mount();

    flux.resize = (value): any => expect(value).to.eq(25);

    selectOptions()[1].click();
    expect(clearOption()).to.not.be.ok;
  });

  function mount() {
    return <PageSize>riot.mount(TAG)[0];
  }
});
