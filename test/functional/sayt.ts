import { Query } from '../../src/tags/query/gb-query';
import { Sayt } from '../../src/tags/sayt/gb-sayt';
import * as utils from '../../src/utils/common';
import suite, { createTag, mixinFlux, removeTag, BaseModel } from './_suite';
import { expect } from 'chai';
import { FluxCapacitor } from 'groupby-api';
import * as riot from 'riot';

const KEY_UP = 38;
const KEY_ENTER = 13;
const KEY_DOWN = 40;

suite<Sayt>('gb-sayt', ({ mount, stub, itMountsTag }) => {

  itMountsTag();

  describe('render with category suggestions', () => {
    it('should render category suggestions', () => {
      const tag = mount();
      const allCategoriesLabel = 'All Categories';
      tag.originalQuery = 'shoe';

      tag.update({
        queries: [{ value: 'a' }],
        categoryResults: [
          { category: allCategoriesLabel, value: 'b', noRefine: true },
          { category: 'c', value: 'd' }
        ]
      });

      const categoryLinks = tag.root.querySelectorAll('gb-sayt-categories gb-sayt-link');
      expect(categoryLinks).to.have.length(2);
      expect((<HTMLElement>categoryLinks[0]).dataset['norefine']).to.eq('true');
      expect(categoryLinks[0].querySelector('.gb-category-query').textContent).to.eq(allCategoriesLabel);
      expect((<HTMLElement>categoryLinks[1]).dataset['norefine']).be.undefined;
      expect(categoryLinks[1].querySelector('.gb-category-query').textContent).to.eq('c');
    });
  });

  describe('autocomplete behaviour', () => {
    let tag: Sayt;
    let model: Model;

    beforeEach(() => {
      const searchBox = document.createElement('input');
      document.body.appendChild(searchBox);
      stub(utils, 'findSearchBox', () => searchBox);
      tag = mount();
      tag.listenForInput(<any>{ searchBox });
      tag.originalQuery = 'shoe';
      searchBox.addEventListener('keydown', (event) => tag.autocomplete.keyboardListener(event, () => null));
      model = new Model(tag);
    });

    it('highlights first element of autocomplete when you press KEY_DOWN from search box', () => {
      tag.update({
        queries: [
          { value: 'a' },
          { value: 'b' }
        ]
      });

      model.keyDown(KEY_DOWN);

      expect(tag.root.querySelectorAll('gb-sayt-link').length).to.eql(2);
      expect((<HTMLElement>tag.root.querySelectorAll('gb-sayt-link')[1]).dataset['value']).to.eql('b');
      expect(tag.root.querySelectorAll('.active')).to.have.length(1);
      expect(tag.root.querySelectorAll('gb-sayt-link.active').length).to.eql(1);
      expect((<HTMLElement>tag.root.querySelector('gb-sayt-link.active')).dataset['value']).to.eql('a');
      // expect(model.searchBox.value).to.eql('a');
    });

    it('highlights next element when you press down', () => {
      tag.update({
        queries: [
          { value: 'a' },
          { value: 'b' }
        ]
      });

      model.keyDown(KEY_DOWN);
      model.keyDown(KEY_DOWN);

      expect(tag.root.querySelectorAll('gb-sayt-link.active').length).to.eql(1);
      expect((<HTMLElement>tag.root.querySelector('gb-sayt-link.active')).dataset['value']).to.eql('b');
      // expect(model.searchBox.value).to.eql('b');
    });

    it('stays selected on the last link when there are no more links to go down to', () => {
      tag.update({
        queries: [
          { value: 'a' },
          { value: 'b' }
        ]
      });

      model.keyDown(KEY_DOWN);
      model.keyDown(KEY_DOWN);
      model.keyDown(KEY_DOWN);

      expect(tag.root.querySelectorAll('gb-sayt-link.active').length).to.eql(1);
      expect((<HTMLElement>tag.root.querySelector('gb-sayt-link.active')).dataset['value']).to.eql('b');
      // expect(model.searchBox.value).to.eql('b');
    });

    it('goes up a link', () => {
      tag.update({
        queries: [
          { value: 'a' },
          { value: 'b' },
          { value: 'c' }
        ]
      });

      model.keyDown(KEY_DOWN);
      model.keyDown(KEY_DOWN);
      model.keyDown(KEY_DOWN);
      model.keyDown(KEY_UP);
      model.keyDown(KEY_UP);

      expect(tag.root.querySelectorAll('gb-sayt-link.active').length).to.eql(1);
      expect((<HTMLElement>tag.root.querySelector('gb-sayt-link.active')).dataset['value']).to.eql('a');
      // expect(model.searchBox.value).to.eql('a');
    });

    it('restores original query to search box and clears selected autocomplete suggestion when you press KEY_UP while at the top suggestion', () => { // tslint:disable-line:max-line-length
      model.searchBox.value = 'original';
      tag.update({
        queries: [
          { value: 'a' },
          { value: 'b' }
        ]
      });

      model.keyDown(KEY_DOWN);
      expect(model.searchBox.value).to.eq('original');
      model.keyDown(KEY_UP);

      expect(model.searchBox.value).to.eq('original');
      expect(tag.root.querySelector('gb-sayt-link.selected')).to.eql(null);
    });

    it('does a search of a suggested query when you click', (done) => {
      model.searchBox.value = 'original';
      tag.search = () => done();
      tag.update({
        queries: [
          { value: 'four' },
          { value: 'five' }
        ]
      });

      (<HTMLElement>tag.root.querySelectorAll('gb-sayt-link a')[1]).click();
    });

    it('does the same thing as clicking when you make .active a suggestion and press enter', (done) => {
      tag.search = () => done();

      tag.update({
        queries: [
          { value: 'four' }
        ]
      });

      model.keyDown(KEY_DOWN);
      model.keyDown(KEY_ENTER);
    });

    it('does a search of a suggested query with a category refinement when you click', () => {
      const refine = stub(tag, 'refine');
      model.searchBox.value = 'original';
      tag.update({
        categoryResults: [
          { value: 'four', category: 'the category' }
        ],
        queries: [{ value: 'four' }]
      });

      (<HTMLElement>tag.root.querySelectorAll('gb-sayt-link a')[0]).click();

      expect(refine).to.be.calledWith(sinon.match({ dataset: { refinement: 'the category' } }));
    });

    it('does a refinement search when you click', () => {
      const refine = stub(tag, 'refine');
      model.searchBox.value = 'original';
      tag.update({
        navigations: [
          {
            displayName: 'Brand',
            name: 'brand000',
            values: ['0', '1', '2', '3']
          }
        ]
      });

      (<HTMLElement>tag.root.querySelectorAll('gb-sayt-link a')[3]).click();

      expect(refine).to.be.calledWith(sinon.match({
        dataset: {
          value: 'Brand: 3',
          refinement: '3'
        }
      }), '');
    });

    it('shows navigations when there are no queries', () => {
      tag.update({
        navigations: [{
          values: ['0', '1', '2']
        }]
      });

      expect(tag.root.querySelectorAll('gb-sayt-link').length).to.eql(3);
    });
  });
});

const TAG = 'gb-query';

describe(`${TAG} tag with sayt:true`, () => {
  let html: HTMLElement;
  let flux: FluxCapacitor;

  beforeEach(() => {
    flux = mixinFlux();
    html = createTag(TAG);
  });
  afterEach(() => removeTag(html));

  describe('autocomplete', () => {
    it('keeps the cursor at the end of the search term in the search box', () => {
      mount();
      const saytTag = html.querySelector('gb-sayt')['_tag'];
      const searchBox = html.querySelector('input');
      saytTag.originalQuery = 'shoe';
      searchBox.value = 'original';
      saytTag.update({
        queries: [
          { value: 'four' },
          { value: '0123456789' },
          { value: 'aaa' }
        ]
      });

      keyDown(KEY_DOWN);
      expect(searchBox.selectionStart).to.eql('four'.length);

      keyDown(KEY_DOWN);
      expect(searchBox.selectionStart).to.eql('0123456789'.length);

      keyDown(KEY_DOWN);
      expect(searchBox.selectionStart).to.eql('aaa'.length);

      keyDown(KEY_UP);
      expect(searchBox.selectionStart).to.eql('0123456789'.length);

      keyDown(KEY_UP);
      expect(searchBox.selectionStart).to.eql('four'.length);

      keyDown(KEY_UP);
      expect(searchBox.selectionStart).to.eql('original'.length);
    });
  });

  function keyDown(keyCode: number) {
    const event = Object.assign(new Event('keydown'), { keyCode });
    html.querySelector('input').dispatchEvent(event);
  }

  function mount(autoSearch: boolean = true) {
    return <Query>riot.mount(html, TAG, { autoSearch })[0];
  }
});

class Model extends BaseModel<Sayt> {

  get sayt(): Sayt {
    return this.element(this.html, 'gb-sayt')['_tag'];
  }

  get searchBox() {
    return this.tag.autocomplete.searchInput;
  }

  keyDown(keyCode: number) {
    this.searchBox.dispatchEvent(Object.assign(new Event('keydown'), { keyCode }));
  }
}
