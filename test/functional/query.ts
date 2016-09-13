import { Query } from '../../src/tags/query/gb-query';
import * as utils from '../../src/utils/common';
import { LOCATION } from '../../src/utils/common';
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

    it('should register for keydown event', () => {
      const tag = mount(false);
      const input = tag.searchBox = document.createElement('input');

      input.addEventListener = (event) => expect(event).to.eq('keydown');

      tag.listenForKeydown();
    });

    // it('should hide autocomplete and modify URL on static search', (done) => {
    //   // TODO: fix test, it doesn't work lol
    //   //
    //   console.log('testtt');
    //   sandbox().stub(utils.LOCATION, 'replace', (url) => expect(url).to.eq('searksdjfhsch?q=lskgjalsdkfj'));
    //   flux().search = (): any => null;
    //   flux().emit = (event): any => expect(event).to.eq('page_changed');
    //
    //   const keyEvent = Object.assign(new Event('keydown'), { keyCode: 13 });
    //
    // const tag = mount(false);
    //   // const input = tag.searchBox = document.createElement('input');
    // const searchBox = tag.searchBox;
    //
    //   // searchBox.addEventListener = (event, cb) => {
    //   //   console.log('event');
    //   //   expect(event).to.eq('keydown');
    //   //   cb({ keyCode: 13 });
    //   // };
    //   searchBox.dispatchEvent(keyEvent);
    // console.log(tag.searchBox);
    //
    //   // tag.keydownListener = () => done();
    //
    //   // tag.listenForStaticSearch();
    // });
    //

    it.only('should hide autocomplete and modify URL on static search', () => {
      sandbox().stub(LOCATION, 'replace', (url) => {
        expect(url).to.eq('search?q=')
      });
      flux().search = (): any => null;
      flux().emit = (event): any => {
        expect(event).to.eq('autocomplete:hide')
      };

      const tag = mount(true);

      // const input = tag.searchBox = document.createElement('input');
      // input.addEventListener = (event, cb) => {
      //   expect(event).to.eq('keydown');
      //   cb({ keyCode: 13 });
      // };

      tag.listenForStaticSearch();
      tag.onSubmit();
    });
  });

  describe('detect mobile device', () => {
    it('should scroll to top on mobile device', () => {
      // sandbox().stub(utils, 'isMobile', () => true);

      // const spy = sinon.spy(tag, 'listenForClick');
      // expect(spy.callCount).to.eq(1000);
      // const searchBox = document.querySelector('input');
      // expect(searchBox.getBoundingClientRect().left).to.eq(1);
      // searchBox.click();
      // expect(searchBox.getBoundingClientRect().left).to.eq(1);
      // expect(searchBox.getBoundingClientRect().top).to.eq(1);
    });
  });

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
