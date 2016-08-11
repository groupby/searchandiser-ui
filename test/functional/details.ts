import { FluxCapacitor } from 'groupby-api';
import { expect } from 'chai';
import { mixinFlux, createTag, removeTag } from '../utils/tags';
import { Details } from '../../src/tags/details/gb-details';
import '../../src/tags/details/gb-details.tag';

const TAG = 'gb-details';

describe(`${TAG} tag`, () => {
  let html: HTMLElement;

  beforeEach(() => {
    mixinFlux({ config: {} });
    html = createTag(TAG);
  });
  afterEach(() => removeTag(html));

  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html.querySelector(`div.${TAG}`)).to.be.ok;
  });

  function mount() {
    return <Details>riot.mount(TAG)[0];
  }
});
