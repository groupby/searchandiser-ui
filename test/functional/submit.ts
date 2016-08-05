import { FluxCapacitor, Events, Results } from 'groupby-api';
import { expect } from 'chai';
import { Submit } from '../../src/tags/submit/gb-submit';
import '../../src/tags/submit/gb-submit.tag';

const TAG = 'gb-submit';

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
    expect(html.querySelector('.gb-submit')).to.be.ok;
    expect(html.querySelector('.gb-submit').textContent).to.eq('🔍');
  });

  function mount() {
    return <Submit>riot.mount(TAG)[0];
  }
});
