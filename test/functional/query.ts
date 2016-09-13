import { Query } from '../../src/tags/query/gb-query';
import { WINDOW } from '../../src/utils';
import suite from './_suite';
import { expect } from 'chai';

suite<Query>('gb-query', ({ flux, html, sandbox, mount: _mount }) => {
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
      sandbox().stub(WINDOW, 'replace', (url) => expect(url).to.eq('search?q='));
      flux().search = (): any => null;
      flux().emit = (event): any => expect(event).to.eq('autocomplete:hide');

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
    return html().querySelector('input');
  }

  function mount(autoSearch: boolean = true) {
    return _mount({ sayt: false, autoSearch });
  }
});
