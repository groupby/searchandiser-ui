import { FluxCapacitor } from 'groupby-api';
import { expect } from 'chai';
import { mockFlux } from '../fixtures';
import { Import } from '../../src/tags/import/gb-import';
import '../../src/tags/import/gb-import.tag';

const TAG = 'gb-import';

describe('gb-import tag', () => {
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
    return <Import>riot.mount(TAG, { flux, config: {} })[0];
  }
});
