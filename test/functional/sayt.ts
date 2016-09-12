import { Query } from '../../src/tags/query/gb-query';
import { Sayt } from '../../src/tags/sayt/gb-sayt';
import { createTag, mixinFlux, removeTag } from './_suite';
import { expect } from 'chai';
import { FluxCapacitor } from 'groupby-api';

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
        tags: { sayt: { minimumCharacters: 1, delay: 0 } },
        url: { queryParam: 'query', searchUrl: 'productSearch' }
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
      mount();
      const saytTag = sayt();
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
    it('highlights first element of autocomplete when you press KEY_DOWN from search box', (done) => {
      const tag = mount();
      const saytTag = sayt();

      saytTag.update({
        queries: [
          { value: 'a' },
          { value: 'b' }
        ]
      });

      tag.on('updated', () => {
        dispatchKeydownEvent(KEY_DOWN);

        expect(html.querySelectorAll('gb-sayt-link').length).to.eql(2);
        expect((<HTMLElement>html.querySelectorAll('gb-sayt-link')[1]).dataset['value']).to.eql('b');
        expect(html.querySelectorAll('.active').length).to.eql(1);
        expect(html.querySelectorAll('gb-sayt-link.active').length).to.eql(1);
        expect((<HTMLElement>html.querySelector('gb-sayt-link.active')).dataset['value']).to.eql('a');

        expect(searchBox().value).to.eql('a');
        done();
      });
    });

    it('highlights next element when you press down', (done) => {
      const tag = mount();
      const saytTag = sayt();

      saytTag.update({
        queries: [
          { value: 'a' },
          { value: 'b' }
        ]
      });

      tag.on('updated', () => {
        dispatchKeydownEvent(KEY_DOWN);
        dispatchKeydownEvent(KEY_DOWN);

        expect(html.querySelectorAll('gb-sayt-link.active').length).to.eql(1);
        expect((<HTMLElement>html.querySelector('gb-sayt-link.active')).dataset['value']).to.eql('b');

        expect(searchBox().value).to.eql('b');
        done();
      });
    });

    it('stays selected on the last link when there are no more links to go down to', (done) => {
      const tag = mount();
      const saytTag = sayt();

      saytTag.update({
        queries: [
          { value: 'a' },
          { value: 'b' }
        ]
      });

      tag.on('updated', () => {
        dispatchKeydownEvent(KEY_DOWN);
        dispatchKeydownEvent(KEY_DOWN);
        dispatchKeydownEvent(KEY_DOWN);

        expect(html.querySelectorAll('gb-sayt-link.active').length).to.eql(1);
        expect((<HTMLElement>html.querySelector('gb-sayt-link.active')).dataset['value']).to.eql('b');

        expect(searchBox().value).to.eql('b');
        done();
      });
    });

    it('goes up a link', (done) => {
      const tag = mount();
      const saytTag = sayt();

      saytTag.update({
        queries: [
          { value: 'a' },
          { value: 'b' },
          { value: 'c' }
        ]
      });

      tag.on('updated', () => {
        dispatchKeydownEvent(KEY_DOWN);
        dispatchKeydownEvent(KEY_DOWN);
        dispatchKeydownEvent(KEY_DOWN);
        dispatchKeydownEvent(KEY_UP);
        dispatchKeydownEvent(KEY_UP);
        expect(html.querySelectorAll('gb-sayt-link.active').length).to.eql(1);
        expect((<HTMLElement>html.querySelector('gb-sayt-link.active')).dataset['value']).to.eql('a');

        expect(searchBox().value).to.eql('a');
        done();
      });
    });

    it('restores original query to search box and clears selected autocomplete suggestion when you press KEY_UP while at the top suggestion', (done) => {
      const tag = mount();
      const saytTag = sayt();

      searchBox().value = 'original';
      saytTag.update({
        queries: [
          { value: 'a' },
          { value: 'b' }
        ]
      });

      tag.on('updated', () => {
        dispatchKeydownEvent(KEY_DOWN);
        dispatchKeydownEvent(KEY_UP);
        expect(searchBox().value).to.eql('original');
        expect(html.querySelector('gb-sayt-link.selected')).to.eql(null);
        done();
      });
    });

    it('keeps the cursor at the end of the search term in the search box', (done) => {
      const tag = mount();
      const saytTag = sayt();

      searchBox().value = 'original';
      saytTag.update({
        queries: [
          { value: 'four' },
          { value: '0123456789' },
          { value: 'aaa' }
        ]
      });

      tag.on('updated', () => {
        dispatchKeydownEvent(KEY_DOWN);
        expect(searchBox().selectionStart).to.eql('four'.length);
        dispatchKeydownEvent(KEY_DOWN);
        expect(searchBox().selectionStart).to.eql('0123456789'.length);
        dispatchKeydownEvent(KEY_DOWN);
        expect(searchBox().selectionStart).to.eql('aaa'.length);
        dispatchKeydownEvent(KEY_UP);
        expect(searchBox().selectionStart).to.eql('0123456789'.length);
        dispatchKeydownEvent(KEY_UP);
        expect(searchBox().selectionStart).to.eql('four'.length);
        dispatchKeydownEvent(KEY_UP);
        expect(searchBox().selectionStart).to.eql('original'.length);
        done();
      });
    });

    it('does a search of a suggested query when you click', (done) => {

      // TODO: Move into unit tests
      // flux.reset = (query): any => {
      //   expect(query).to.eq('five');
      //   done();
      // };

      const tag = mount();
      const saytTag = sayt();
      saytTag.search = () => done();

      searchBox().value = 'original';
      saytTag.update({
        queries: [
          { value: 'four' },
          { value: 'five' }
        ]
      });

      tag.on('updated', () => {
        (<HTMLElement>saytTag.root.querySelectorAll('gb-sayt-link a')[1]).click();
      });
    });

    it('does the same thing as clicking when you make .active a suggestion and press enter', (done) => {
      const tag = mount();
      const saytTag = sayt();
      saytTag.search = () => done();

      saytTag.update({
        queries: [
          { value: 'four' }
        ]
      });

      tag.on('updated', () => {
        dispatchKeydownEvent(KEY_DOWN);
        dispatchKeydownEvent(KEY_ENTER);
      });
    });

    it('does a search of a suggested query with a category refinement when you click', (done) => {
      const tag = mount();
      const saytTag = sayt();

      saytTag.refine = (target, query) => {
        expect(target.parentElement.dataset['refinement']).to.eq('the category');
        done();
      };

      searchBox().value = 'original';
      saytTag.update({
        categoryResults: [
          { value: 'four', category: 'the category' }
        ],
        // this is necessary in order to have autocomplete be visible
        queries: ['four']
      });

      tag.on('updated', () => {
        (<HTMLElement>saytTag.root.querySelectorAll('gb-sayt-link a')[0]).click();
      });
    });

    it('does a refinement search when you click', (done) => {
      const tag = mount();
      const saytTag = sayt();
      saytTag.refine = (target, query) => {
        expect(query).to.eq('');
        expect(target.parentElement.dataset['field']).to.eq('brand000');
        expect(target.parentElement.dataset['value']).to.eq('Brand: 3');
        expect(target.parentElement.dataset['refinement']).to.eq('3');
        done();
      };

      searchBox().value = 'original';
      saytTag.update({
        navigations: [
          {
            displayName: 'Brand',
            name: 'brand000',
            values: [0, 1, 2, 3]
          }
        ]
      });

      tag.on('updated', () => {
        (<HTMLElement>saytTag.root.querySelectorAll('gb-sayt-link a')[3]).click();
      });
    });

    it('shows navigations when there are no queries', (done) => {
      const tag = mount();
      const saytTag = sayt();

      saytTag.update({
        navigations: [{
          values: [{}, {}, {}]
        }]
      });

      tag.on('updated', () => {
        expect(saytTag.root.querySelectorAll('gb-sayt-link').length).to.eql(3);
        done();
      });
    });
  });

  function dispatchKeydownEvent(keyCode: number) {
    const event = Object.assign(new Event('keydown'), { keyCode });
    searchBox().dispatchEvent(event);
  }

  function searchBox() {
    return html.querySelector('input');
  }

  function sayt(): Sayt {
    return html.querySelector('gb-sayt')['_tag'];
  }

  function mount(autoSearch: boolean = true) {
    return <Query>riot.mount(html, TAG, { sayt: true, autoSearch })[0];
  }
});
