import { Query } from '../../src/tags/query/gb-query';
import { AUTOCOMPLETE_HIDE_EVENT } from '../../src/tags/sayt/autocomplete';
import { LOCATION } from '../../src/utils/common';
import suite, { BaseModel } from './_suite';
import { expect } from 'chai';

suite<Query>('gb-query', ({ flux, sandbox, mount: _mount, itMountsTag }) => {

  itMountsTag();

  describe('render', () => {
    it('should render search box', () => {
      mount();

      expect(document.querySelector('gb-search-box')).to.be.ok;
    });
  });

  it('should rewrite query on rewrite_query', () => {
    const tag = mount();
    const model = new Model(tag);
    const query = 'rewritten';

    tag.rewriteQuery(query);

    expect(model.searchBox.value).to.eq(query);
  });

  describe('redirect when autoSearch off', () => {
    it('should register for input event', () => {
      const tag = mount(false);
      const input = tag.searchBox = document.createElement('input');
      const spy = input.addEventListener = sinon.spy();

      tag.listenForInput();

      expect(spy.calledWith('input'));
    });

    it.skip('should hide autocomplete and modify URL on static search', () => {
      // doesn't actually test the thing
      sandbox().stub(LOCATION, 'replace', (url) => expect(url).to.eq('search?q='));
      flux().search = (): any => null;
      flux().emit = (event): any => expect(event).to.eq(AUTOCOMPLETE_HIDE_EVENT);

      const tag = mount(false);

      const input = tag.searchBox = document.createElement('input');
      input.addEventListener = (event, cb) => {
        expect(event).to.eq('keydown');
        cb({ keyCode: 13 });
      };

      tag.listenForStaticSearch();
    });
  });

  function mount(autoSearch: boolean = true) {
    return _mount({ sayt: false, autoSearch });
  }
});

class Model extends BaseModel<Query> {
  get searchBox() {
    return this.element<HTMLInputElement>(this.html, 'input');
  }
}
