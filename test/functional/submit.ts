import { FluxCapacitor, Events, Results } from 'groupby-api';
import { expect } from 'chai';
import { mixinFlux, createTag, removeTag } from '../utils/tags';
import { Submit } from '../../src/tags/submit/gb-submit';
import '../../src/tags/submit/gb-submit.tag';

const TAG = 'gb-submit';

describe(`${TAG} tag`, () => {
  let html: HTMLElement,
    flux: FluxCapacitor;

  beforeEach(() => {
    flux = mixinFlux();
    html = createTag(TAG);
  });
  afterEach(() => removeTag(html));

  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html.querySelector('.gb-submit')).to.be.ok;
    expect(html.querySelector('.gb-submit').textContent).to.eq('🔍');
  });

  it('should reset query', () => {
    const tag = mount();
    tag.searchBox = <HTMLInputElement & any>{ value: 'old' };

    flux.reset = (value): any => expect(value).to.eq('old');

    tag.root.click();
  });

  function mount() {
    return <Submit>riot.mount(TAG)[0];
  }
});
