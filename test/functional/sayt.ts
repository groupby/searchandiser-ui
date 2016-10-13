import { Query } from '../../src/tags/query/gb-query';
import { Sayt } from '../../src/tags/sayt/gb-sayt';
import { createTag, mixinFlux, removeTag, BaseModel } from './_suite';
import { expect } from 'chai';
import { FluxCapacitor } from 'groupby-api';
import * as riot from 'riot';

const TAG = 'gb-query';
const KEY_UP = 38;
const KEY_ENTER = 13;
const KEY_DOWN = 40;

describe(`${TAG} tag with sayt:true`, () => {
  let html: HTMLElement;
  let flux: FluxCapacitor;

  beforeEach(() => {
    flux = mixinFlux({
      config: {
        tags: { sayt: { minimumCharacters: 1, delay: 0 } }
      }
    });
    html = createTag(TAG);
  });
  afterEach(() => {
    removeTag(html);
  });

  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(document.querySelector('gb-sayt')).to.be.ok;
  });

  describe('category suggestions', () => {
    it('should render category suggestions', () => {
      const model = new Model(mount());
      const saytTag = model.sayt;
      const allCategoriesLabel = 'All Categories';

      saytTag.update({
        queries: [{ value: 'a' }],
        categoryResults: [
          { category: allCategoriesLabel, value: 'b', noRefine: true },
          { category: 'c', value: 'd' }
        ]
      });

      const categoryLinks = html.querySelectorAll('gb-sayt-categories gb-sayt-link');
      expect(categoryLinks.length).to.eq(2);
      expect((<HTMLElement>categoryLinks[0]).dataset['norefine']).to.eq('true');
      expect(categoryLinks[0].querySelector('.gb-category-query').textContent).to.eq(allCategoriesLabel);
      expect((<HTMLElement>categoryLinks[1]).dataset['norefine']).be.undefined;
      expect(categoryLinks[1].querySelector('.gb-category-query').textContent).to.eq('c');
    });
  });

  describe('autocomplete', () => {
    it('highlights first element of autocomplete when you press KEY_DOWN from search box', () => {
      const tag = mount();
      const model = new Model(tag);
      const saytTag = model.sayt;
      saytTag.update({
        queries: [
          { value: 'a' },
          { value: 'b' }
        ]
      });

      model.keyDown(KEY_DOWN);

      expect(html.querySelectorAll('gb-sayt-link').length).to.eql(2);
      expect((<HTMLElement>html.querySelectorAll('gb-sayt-link')[1]).dataset['value']).to.eql('b');
      expect(html.querySelectorAll('.active').length).to.eql(1);
      expect(html.querySelectorAll('gb-sayt-link.active').length).to.eql(1);
      expect((<HTMLElement>html.querySelector('gb-sayt-link.active')).dataset['value']).to.eql('a');
      expect(model.searchBox.value).to.eql('a');
    });

    it('highlights next element when you press down', () => {
      const tag = mount();
      const model = new Model(tag);
      const saytTag = model.sayt;
      saytTag.update({
        queries: [
          { value: 'a' },
          { value: 'b' }
        ]
      });

      model.keyDown(KEY_DOWN);
      model.keyDown(KEY_DOWN);

      expect(html.querySelectorAll('gb-sayt-link.active').length).to.eql(1);
      expect((<HTMLElement>html.querySelector('gb-sayt-link.active')).dataset['value']).to.eql('b');
      expect(model.searchBox.value).to.eql('b');
    });

    it('stays selected on the last link when there are no more links to go down to', () => {
      const tag = mount();
      const model = new Model(tag);
      const saytTag = model.sayt;
      saytTag.update({
        queries: [
          { value: 'a' },
          { value: 'b' }
        ]
      });

      model.keyDown(KEY_DOWN);
      model.keyDown(KEY_DOWN);
      model.keyDown(KEY_DOWN);

      expect(html.querySelectorAll('gb-sayt-link.active').length).to.eql(1);
      expect((<HTMLElement>html.querySelector('gb-sayt-link.active')).dataset['value']).to.eql('b');
      expect(model.searchBox.value).to.eql('b');
    });

    it('goes up a link', () => {
      const tag = mount();
      const model = new Model(tag);
      const saytTag = model.sayt;
      saytTag.update({
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

      expect(html.querySelectorAll('gb-sayt-link.active').length).to.eql(1);
      expect((<HTMLElement>html.querySelector('gb-sayt-link.active')).dataset['value']).to.eql('a');
      expect(model.searchBox.value).to.eql('a');
    });

    it(`restores original query to search box and clears selected autocomplete
        suggestion when you press KEY_UP while at the top suggestion`, () => {
        const tag = mount();
        const model = new Model(tag);
        const saytTag = model.sayt;
        model.searchBox.value = 'original';
        saytTag.update({
          queries: [
            { value: 'a' },
            { value: 'b' }
          ]
        });

        model.keyDown(KEY_DOWN);
        model.keyDown(KEY_UP);

        expect(model.searchBox.value).to.eql('original');
        expect(html.querySelector('gb-sayt-link.selected')).to.eql(null);
      });

    it('keeps the cursor at the end of the search term in the search box', () => {
      const tag = mount();
      const model = new Model(tag);
      const saytTag = model.sayt;
      model.searchBox.value = 'original';
      saytTag.update({
        queries: [
          { value: 'four' },
          { value: '0123456789' },
          { value: 'aaa' }
        ]
      });

      model.keyDown(KEY_DOWN);
      expect(model.searchBox.selectionStart).to.eql('four'.length);

      model.keyDown(KEY_DOWN);
      expect(model.searchBox.selectionStart).to.eql('0123456789'.length);

      model.keyDown(KEY_DOWN);
      expect(model.searchBox.selectionStart).to.eql('aaa'.length);

      model.keyDown(KEY_UP);
      expect(model.searchBox.selectionStart).to.eql('0123456789'.length);

      model.keyDown(KEY_UP);
      expect(model.searchBox.selectionStart).to.eql('four'.length);

      model.keyDown(KEY_UP);
      expect(model.searchBox.selectionStart).to.eql('original'.length);
    });

    it('does a search of a suggested query when you click', (done) => {
      const tag = mount();
      const model = new Model(tag);
      const saytTag = model.sayt;
      saytTag.search = () => done();
      model.searchBox.value = 'original';
      saytTag.update({
        queries: [
          { value: 'four' },
          { value: 'five' }
        ]
      });

      (<HTMLElement>saytTag.root.querySelectorAll('gb-sayt-link a')[1]).click();
    });

    it('does the same thing as clicking when you make .active a suggestion and press enter', (done) => {
      const tag = mount();
      const model = new Model(tag);
      const saytTag = model.sayt;
      saytTag.search = () => done();

      saytTag.update({
        queries: [
          { value: 'four' }
        ]
      });

      model.keyDown(KEY_DOWN);
      model.keyDown(KEY_ENTER);
    });

    it('does a search of a suggested query with a category refinement when you click', (done) => {
      const tag = mount();
      const model = new Model(tag);
      const saytTag = model.sayt;
      saytTag.refine = (target, query) => {
        expect(target.parentElement.dataset['refinement']).to.eq('the category');
        done();
      };
      model.searchBox.value = 'original';
      saytTag.update({
        categoryResults: [
          { value: 'four', category: 'the category' }
        ],
        // this is necessary in order to have autocomplete be visible
        queries: ['four']
      });

      (<HTMLElement>saytTag.root.querySelectorAll('gb-sayt-link a')[0]).click();
    });

    it('does a refinement search when you click', (done) => {
      const tag = mount();
      const model = new Model(tag);
      const saytTag = model.sayt;
      saytTag.refine = (target, query) => {
        expect(query).to.eq('');
        expect(target.parentElement.dataset['field']).to.eq('brand000');
        expect(target.parentElement.dataset['value']).to.eq('Brand: 3');
        expect(target.parentElement.dataset['refinement']).to.eq('3');
        done();
      };
      model.searchBox.value = 'original';
      saytTag.update({
        navigations: [
          {
            displayName: 'Brand',
            name: 'brand000',
            values: [0, 1, 2, 3]
          }
        ]
      });

      (<HTMLElement>saytTag.root.querySelectorAll('gb-sayt-link a')[3]).click();
    });

    it('shows navigations when there are no queries', () => {
      const tag = mount();
      const model = new Model(tag);
      const saytTag = model.sayt;

      saytTag.update({
        navigations: [{
          values: [{}, {}, {}]
        }]
      });

      expect(saytTag.root.querySelectorAll('gb-sayt-link').length).to.eql(3);
    });
  });

  function mount(autoSearch: boolean = true) {
    return <Query>riot.mount(html, TAG, { sayt: true, autoSearch })[0];
  }
});

class Model extends BaseModel<Query> {

  get sayt(): Sayt {
    return this.element(this.html, 'gb-sayt')['_tag'];
  }

  get searchBox() {
    return this.element<HTMLInputElement>(this.html, 'input');
  }

  keyDown(keyCode: number) {
    this.searchBox.dispatchEvent(Object.assign(new Event('keydown'), { keyCode }));
  }
}
