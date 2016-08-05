import { FluxCapacitor, Events, Results } from 'groupby-api';
import { expect } from 'chai';
import { selectOptions, clearOption, label } from '../utils/raw-select';
import { PageSize } from '../../src/tags/page-size/gb-page-size';
import '../../src/tags/page-size/gb-raw-page-size.tag';

const TAG = 'gb-raw-page-size';

describe(`${TAG} tag`, () => {
  let html: Element,
    flux: FluxCapacitor;

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

  it('renders from pageSizes', () => {
    const tag = mount();

    expect(html.querySelector('.gb-select__content')).to.be.ok;
    expect(label().textContent).to.eq('10');
    expect(selectOptions().length).to.eq(4);
  });

  it('should resize on option selected', () => {
    const tag = mount();

    flux.resize = (value): any => expect(value).to.eq(25);

    selectOptions()[1].click();
    expect(clearOption()).to.not.be.ok;
  });

  function mount() {
    return <PageSize>riot.mount(TAG, { config: {} })[0];
  }
});
