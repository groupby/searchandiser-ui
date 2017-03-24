import { Query } from '../../src/tags/query/gb-query';
import suite, { BaseModel } from './_suite';

suite<Query>('gb-query', ({ spy, mount: _mount, expect, itMountsTag }) => {

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
      const addEventListener = spy();
      tag.searchBox = Object.assign(document.createElement('input'), { addEventListener });

      tag.listenForInput();

      expect(addEventListener.calledWith('input'));
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
