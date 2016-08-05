import { FluxCapacitor, Events, Results } from 'groupby-api';
import { expect } from 'chai';
import { selectOptions } from '../utils/select';
import { Sort } from '../../src/tags/sort/gb-sort';
import '../../src/tags/sort/gb-sort.tag';

const TAG = 'gb-sort';

describe(`${TAG} tag`, () => {
  let html: Element;

  beforeEach(() => {
    riot.mixin('test', { flux: new FluxCapacitor('') });
    document.body.appendChild(html = document.createElement(TAG));
  });
  afterEach(() => document.body.removeChild(html));

  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html.querySelector('gb-raw-sort')).to.be.ok;
  });

  it('renders from sorts', () => {
    const tag = mount();

    expect(selectOptions().length).to.eq(2);
    expect(selectOptions()[1].textContent).to.eq('Name Ascending');
  });

  function mount() {
    return <Sort>riot.mount(TAG, { config: {} })[0];
  }
});
