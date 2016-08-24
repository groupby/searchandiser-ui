import { FluxCapacitor, Events, Results } from 'groupby-api';
import { expect } from 'chai';
import { mixinFlux, createTag, removeTag } from '../utils/tags';
import { Query } from '../../src/tags/query/gb-query';
import { Sayt } from '../../src/tags/sayt/gb-sayt';
import { Autocomplete } from '../../src/tags/sayt/autocomplete.ts'
import '../../src/tags/query/gb-query.tag';

const TAG = 'gb-query';
const KEY_UP = 38;
const KEY_ENTER = 13;
const KEY_DOWN = 40;
const KEY_BACKSPACE = 8;
const KEY_DEL = 46;

describe(`${TAG} tag with sayt:true`, () => {
  let html: HTMLElement;
  let flux: FluxCapacitor;
  let sandbox: Sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    flux = mixinFlux();
    html = createTag(TAG);
  });
  afterEach(() => {
    sandbox.restore();
    removeTag(html);
  });

  it('mounts tag', () => {
    flux = mixinFlux({
      config: { tags: { sayt: {} } }
    });
    const tag = mount();

    expect(tag).to.be.ok;
    expect(document.querySelector('gb-sayt')).to.be.ok;
  });

  describe('autocomplete', () => {
    it('puts .active on first element of autocomplete when you press KEY_DOWN from search box', (done) => {
      flux = mixinFlux({
        config: { tags: { sayt: {} } }
      });
      const tag = mount();
      const saytTag: Sayt = <Sayt>((<any>html.querySelector('gb-sayt'))._tag);
      const autocomplete: Autocomplete = saytTag.autocomplete;

      saytTag.update({
        queries: [
          { value: 'a' },
          { value: 'b' }
        ]
      });

      while (!(saytTag.root.querySelector('gb-sayt-link')));

      searchBox().focus();

      autocomplete.selectFirstLink = () => {
        done();
      };

      const e = new Event('keydown');
      Object.assign(e, { keyCode: KEY_DOWN });
      document.querySelector('input').dispatchEvent(e);
      searchBox().dispatchEvent(e);
    });
  });


  function searchBox() {
    return html.querySelector('input');
  }

  function mount(autoSearch: boolean = true) {
    return <Query>riot.mount(html, TAG, { sayt: true, autoSearch })[0];
  }
});
