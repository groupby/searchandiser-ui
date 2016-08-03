import { FluxCapacitor, Events, Results } from 'groupby-api';
import { expect } from 'chai';
import { mockFlux } from '../fixtures';
import { selectOptions } from '../utils/select';
import { PageSize } from '../../src/tags/page-size/gb-page-size';
import '../../src/tags/page-size/gb-page-size.tag';

const TAG = 'gb-page-size';

describe('gb-page-size tag', () => {
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
    expect(html.querySelector('gb-raw-page-size')).to.be.ok;
  });

  it('renders from pageSizes', () => {
    const tag = mount();

    expect(selectOptions().length).to.eq(4);
    expect(selectOptions()[2].textContent).to.eq('50');
  });

  function mount() {
    return <PageSize>riot.mount(TAG, { flux, config: {} })[0];
  }
});