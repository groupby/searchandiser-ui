import { FluxCapacitor, Events, Results } from 'groupby-api';
import { expect } from 'chai';
import { mixinFlux, createTag, removeTag } from '../utils/tags';
import { Query } from '../../src/tags/query/gb-query';
import '../../src/tags/query/gb-query.tag';

const TAG = 'gb-query';

describe(`${TAG} tag`, () => {
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
    const tag = mount();

    expect(tag).to.be.ok;
    expect(document.querySelector('gb-search-box')).to.be.ok;
  });

  it('should rewrite query on rewrite_query', () => {
    const tag = mount();
    const query = 'rewritten';

    tag.rewriteQuery(query);
    expect(searchBox().value).to.eq(query);
  });

  describe('redirect when autoSearch off', () => {
    it('should register for input event', () => {
      const tag = mount(false);

      const input = tag.searchBox = document.createElement('input');
      input.addEventListener = (event) => expect(event).to.eq('input');

      tag.listenForInput();
    });

    it('should hide autocomplete and modify URL on static search', () => {
      sandbox.stub(window.location, 'replace', (url) => expect(url).to.eq('search?q='));
      flux.search = (): any => { };
      flux.emit = (event): any => expect(event).to.eq('autocomplete:hide');

      const tag = mount(false);

      const input = tag.searchBox = document.createElement('input');
      input.addEventListener = (event, cb) => {
        expect(event).to.eq('keydown');
        cb({ keyCode: 13 });
      };

      tag.listenForStaticSearch();
    });
  });

  function searchBox() {
    return html.querySelector('input');
  }

  function mount(autoSearch: boolean = true) {
    return <Query>riot.mount(html, TAG, { sayt: false, autoSearch })[0];
  }
});
