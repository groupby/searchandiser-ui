import { FluxCapacitor } from 'groupby-api';
import { expect } from 'chai';
import { mockFlux } from '../fixtures';
import { Details } from '../../src/tags/details/gb-details';
import '../../src/tags/details/gb-details.tag';

const TAG = 'gb-details';

describe('gb-details tag', () => {
  let html: Element;
  const flux = new FluxCapacitor('');
  beforeEach(() => document.body.appendChild(html = document.createElement(TAG)));
  afterEach(() => document.body.removeChild(html));

  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html.querySelector(`div.${TAG}`)).to.be.ok;
  });

  function mount() {
    return <Details>riot.mount(TAG, { flux, config: {} })[0];
  }
});
