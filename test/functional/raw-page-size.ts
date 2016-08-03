import { FluxCapacitor, Events, Results } from 'groupby-api';
import { expect } from 'chai';
import { mockFlux } from '../fixtures';
import { PageSize } from '../../src/tags/page-size/gb-page-size';
import '../../src/tags/page-size/gb-raw-page-size.tag';

const TAG = 'gb-raw-page-size';

describe('gb-raw-page-size tag', () => {
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
    it('renders from pageSizes', () => {
      const tag = mount();

      expect(html.querySelector('.gb-select__content')).to.be.ok;
      expect(selectOptions().length).to.eq(4);
    });

    it('does not show a clear option', () => {
      const tag = mount();
      flux.resize = (value): any => expect(value).to.eq(25);

      selectOptions()[1].click();
      expect(clearOption()).to.not.be.ok;
    });
  });

  function clearOption() {
    return <HTMLLIElement>html.querySelector('.gb-select__option.clear > gb-option-wrapper');
  }

  function selectOptions() {
    return <NodeListOf<HTMLLIElement>>html.querySelectorAll('.gb-select__option:not(.clear) > gb-option-wrapper');
  }

  function mount() {
    return <PageSize>riot.mount(TAG, { flux, config: {} })[0];
  }
});
