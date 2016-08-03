import { FluxCapacitor, Events, Results } from 'groupby-api';
import { expect } from 'chai';
import { mockFlux } from '../fixtures';
import { Sort } from '../../src/tags/sort/gb-sort';
import '../../src/tags/sort/gb-raw-sort.tag';

const TAG = 'gb-raw-sort';

describe('gb-raw-sort tag', () => {
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

  it('renders from sorts', () => {
    const tag = mount();

    expect(html.querySelector('.gb-select__content')).to.be.ok;
    expect(selectOptions().length).to.eq(2);
  });

  it('should sort on option selected', () => {
    const tag = mount();

    flux.sort = (sort): any => expect(sort).to.eql({ field: 'title', order: 'Ascending' });

    selectOptions()[1].click();
    expect(clearOption()).to.not.be.ok;
  });

  function clearOption() {
    return <HTMLLIElement>html.querySelector('.gb-select__option.clear > gb-option-wrapper');
  }

  function selectOptions() {
    return <NodeListOf<HTMLLIElement>>html.querySelectorAll('.gb-select__option:not(.clear) > gb-option-wrapper');
  }

  function mount() {
    return <Sort>riot.mount(TAG, { flux })[0];
  }
});
