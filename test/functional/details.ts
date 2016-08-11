import { FluxCapacitor } from 'groupby-api';
import { expect } from 'chai';
import { Details } from '../../src/tags/details/gb-details';
import '../../src/tags/details/gb-details.tag';

const TAG = 'gb-details';

describe(`${TAG} tag`, () => {
  let html: Element;

  beforeEach(() => {
    riot.mixin('test', { flux: new FluxCapacitor(''), config: {} });
    document.body.appendChild(html = document.createElement(TAG));
  });
  afterEach(() => document.body.removeChild(html));

  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html.querySelector(`div.${TAG}`)).to.be.ok;
  });

  function mount() {
    return <Details>riot.mount(TAG)[0];
  }
});
