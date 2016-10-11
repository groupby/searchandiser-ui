import { Query } from '../../src/tags/query/gb-query';
import * as utils from '../../src/utils/common';
import { LOCATION } from '../../src/utils/common';
import suite from './_suite';
import { expect } from 'chai';

suite<Query>('gb-query', ({ flux, html, sandbox, mount: _mount }) => {
  it.only('mounts tag', () => {
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

    it('should register for keydown event', () => {
      const tag = mount(false);
      const input = tag.searchBox = document.createElement('input');

      input.addEventListener = (event) => expect(event).to.eq('keydown');

      tag.listenForKeydown();
    });

    //   it.only('should hide autocomplete and modify URL on static search', () => {
    //
    //   // TODO: fix test, it doesn't work lol
    //     sandbox().stub(LOCATION, 'replace', (url) => {
    //       expect(url).to.eq('search?q=')
    //     });
    //     flux().search = (): any => null;
    //     flux().emit = (event): any => {
    //       expect(event).to.eq('autocomplete:hide')
    //     };
    //
    //     const tag = mount(true);
    //
    //     // const input = tag.searchBox = document.createElement('input');
    //     // input.addEventListener = (event, cb) => {
    //     //   expect(event).to.eq('keydown');
    //     //   cb({ keyCode: 13 });
    //     // };
    //
    //     tag.listenForStaticSearch();
    //     tag.onSubmit();
    //   });
    // });

    function searchBox() {
      return html().querySelector('input');
    }

    function mount(autoSearch: boolean = true) {
      return _mount({ sayt: false, autoSearch });
    }

    function setUserAgent(window, userAgent) {
      if (window.navigator.userAgent != userAgent) {
        var userAgentProp = { get: function() { return userAgent; } };
        try {
          Object.defineProperty(window.navigator, 'userAgent', userAgentProp);
        } catch (e) {
          window.navigator = Object.create(navigator, {
            userAgent: userAgentProp
          });
        }
      }
    }
  });
