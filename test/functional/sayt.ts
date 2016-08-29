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
    it('highlights first element of autocomplete when you press KEY_DOWN from search box', (done) => {
      flux = mixinFlux({
        config: { tags: { sayt: { minimumCharacters: 1, delay: 0 } } }
      });
      const tag = mount();
      const saytTag = <Sayt>html.querySelector('gb-sayt')['_tag'];
      const autocomplete = saytTag.autocomplete;

      saytTag.update({
        queries: [
          { value: 'a' },
          { value: 'b' }
        ]
      });

      while (!saytTag.root.querySelector('gb-sayt-link'));

      autocomplete['f'] = autocomplete.selectFirstLink;
      autocomplete.selectFirstLink = () => {
        autocomplete['f']();
        expect(html.querySelectorAll('gb-sayt-link').length).to.eql(2);
        expect((<HTMLElement>html.querySelectorAll('gb-sayt-link')[1]).dataset['value']).to.eql('b');
        expect(html.querySelectorAll('.active').length).to.eql(1);
        expect(html.querySelectorAll('gb-sayt-link.active').length).to.eql(1);
        expect((<HTMLElement>html.querySelector('gb-sayt-link.active')).dataset['value']).to.eql('a');

        expect(searchBox().value).to.eql('a');
        done();
      };

      searchBox().focus();
      dispatchKeydownEvent(searchBox(), KEY_DOWN);
    });

    it('highlights next element when you press down', (done) => {
      flux = mixinFlux({
        config: { tags: { sayt: { minimumCharacters: 1, delay: 0 } } }
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


      autocomplete['f'] = autocomplete.selectOneBelow;
      autocomplete.selectOneBelow = () => {
        autocomplete['f']();
        expect(html.querySelectorAll('gb-sayt-link.active').length).to.eql(1);
        expect((<HTMLElement>html.querySelector('gb-sayt-link.active')).dataset['value']).to.eql('b');

        expect(searchBox().value).to.eql('b');
        done();
      };

      searchBox().focus();
      dispatchKeydownEvent(searchBox(), KEY_DOWN);
      dispatchKeydownEvent(searchBox(), KEY_DOWN);
    });

    it('gracefully handles there not being any more links to go down to', (done) => {
      flux = mixinFlux({
        config: { tags: { sayt: { minimumCharacters: 1, delay: 0 } } }
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

      let noTimesCalled = 0;
      autocomplete['f'] = autocomplete.selectOneBelow;
      autocomplete.selectOneBelow = () => {
        autocomplete['f']();
        ++noTimesCalled;
        if (noTimesCalled === 2) {
          expect(html.querySelectorAll('gb-sayt-link.active').length).to.eql(1);
          expect((<HTMLElement>html.querySelector('gb-sayt-link.active')).dataset['value']).to.eql('b');

          expect(searchBox().value).to.eql('b');
          done();
        }
      };

      searchBox().focus();
      dispatchKeydownEvent(searchBox(), KEY_DOWN);
      dispatchKeydownEvent(searchBox(), KEY_DOWN);
      dispatchKeydownEvent(searchBox(), KEY_DOWN);
    });

    it('goes up a link', (done) => {
      flux = mixinFlux({
        config: { tags: { sayt: { minimumCharacters: 1, delay: 0 } } }
      });
      const tag = mount();
      const saytTag: Sayt = <Sayt>((<any>html.querySelector('gb-sayt'))._tag);
      const autocomplete: Autocomplete = saytTag.autocomplete;

      saytTag.update({
        queries: [
          { value: 'a' },
          { value: 'b' },
          { value: 'c' }
        ]
      });

      while (!(saytTag.root.querySelector('gb-sayt-link')));


      let noTimesDown = 0;
      let noTimesUp = 0;
      autocomplete['f1'] = autocomplete.selectOneAbove;
      autocomplete.selectOneAbove = () => {
        ++noTimesUp;
        autocomplete['f1']();
        if (noTimesDown === 2 && noTimesUp === 2) {
          expect(html.querySelectorAll('gb-sayt-link.active').length).to.eql(1);
          expect((<HTMLElement>html.querySelector('gb-sayt-link.active')).dataset['value']).to.eql('a');

          expect(searchBox().value).to.eql('a');
          done();
        }
      };
      autocomplete['f2'] = autocomplete.selectOneBelow;
      autocomplete.selectOneBelow = () => {
        ++noTimesDown;
        autocomplete['f2']();
      };

      searchBox().focus();
      dispatchKeydownEvent(searchBox(), KEY_DOWN);
      dispatchKeydownEvent(searchBox(), KEY_DOWN);
      dispatchKeydownEvent(searchBox(), KEY_DOWN);
      dispatchKeydownEvent(searchBox(), KEY_UP);
      dispatchKeydownEvent(searchBox(), KEY_UP);
    });

    it('restores original query to search box and clears selected autocomplete suggestion when you press KEY_UP while at the top suggestion', (done) => {
      flux = mixinFlux({
        config: { tags: { sayt: { minimumCharacters: 1, delay: 0 } } }
      });
      const tag = mount();
      const saytTag: Sayt = <Sayt>((<any>html.querySelector('gb-sayt'))._tag);
      const autocomplete: Autocomplete = saytTag.autocomplete;

      searchBox().value = 'original';
      saytTag.update({
        queries: [
          { value: 'a' },
          { value: 'b' }
        ]
      });

      while (!(saytTag.root.querySelector('gb-sayt-link')));

      let noReset = 0;
      autocomplete['f'] = autocomplete.reset;
      autocomplete.reset = () => {
        ++noReset;
        autocomplete['f']();
        if (noReset === 1) {
          expect(searchBox().value).to.eql('original');
          expect(html.querySelector('gb-sayt-link.selected')).to.eql(null);
          done();
        }
      };

      searchBox().focus();
      dispatchKeydownEvent(searchBox(), KEY_DOWN);
      dispatchKeydownEvent(searchBox(), KEY_UP);
    });

    it('keeps the cursor at the end of the search term in the search box', (done) => {
      flux = mixinFlux({
        config: { tags: { sayt: { minimumCharacters: 1, delay: 0 } } }
      });
      const tag = mount();
      const saytTag: Sayt = <Sayt>((<any>html.querySelector('gb-sayt'))._tag);
      const autocomplete: Autocomplete = saytTag.autocomplete;


      searchBox().value = 'original';
      saytTag.update({
        queries: [
          { value: 'four' },
          { value: '0123456789' },
          { value: 'aaa' }
        ]
      });

      while (!(saytTag.root.querySelector('gb-sayt-link')));

      let noTimesSelectedFirstLink = 0;
      autocomplete['f0'] = autocomplete.selectFirstLink;
      autocomplete.selectFirstLink = () => {
        ++noTimesSelectedFirstLink;
        autocomplete['f0']();
        if (noTimesSelectedFirstLink === 1) {
          expect(searchBox().selectionStart).to.eql('four'.length);
        }
      };

      let noTimesDown = 0;
      autocomplete['f1'] = autocomplete.selectOneBelow;
      autocomplete.selectOneBelow = () => {
        ++noTimesDown;
        autocomplete['f1']();
        if (noTimesDown === 1) {
          expect(searchBox().selectionStart).to.eql('0123456789'.length);
        }
        else if (noTimesDown === 2) {
          expect(searchBox().selectionStart).to.eql('aaa'.length);
        }
      };

      let noTimesUp = 0;
      autocomplete['f2'] = autocomplete.selectOneAbove;
      autocomplete.selectOneAbove = () => {
        ++noTimesUp;
        autocomplete['f2']();
        if (noTimesUp === 1) {
          expect(searchBox().selectionStart).to.eql('0123456789'.length);
        }
        else if (noTimesUp === 2) {
          expect(searchBox().selectionStart).to.eql('four'.length);
        }
      };

      let noTimesReset = 0;
      autocomplete['f3'] = autocomplete.reset;
      autocomplete.reset = () => {
        ++noTimesReset;
        autocomplete['f3']();
        if (noTimesReset === 1) {
          expect(noTimesSelectedFirstLink).to.eql(1);
          expect(noTimesDown).to.eql(2);
          expect(noTimesUp).to.eql(2);
          expect(searchBox().selectionStart).to.eql('original'.length);
          done();
        }
      }

      // TODO make sure we get to the end oforiginal query string

      searchBox().focus();
      dispatchKeydownEvent(searchBox(), KEY_DOWN);
      dispatchKeydownEvent(searchBox(), KEY_DOWN);
      dispatchKeydownEvent(searchBox(), KEY_DOWN);
      dispatchKeydownEvent(searchBox(), KEY_UP);
      dispatchKeydownEvent(searchBox(), KEY_UP);
      dispatchKeydownEvent(searchBox(), KEY_UP);
    });

    it('does a search of a suggested query when you click', (done) => {
      flux = mixinFlux({
        config: { tags: { sayt: { minimumCharacters: 1, delay: 0 } } }
      });
      flux.reset = (query): any => {
        expect(query).to.eq('five');
        done();
      };

      const tag = mount();
      const saytTag: Sayt = <Sayt>((<any>html.querySelector('gb-sayt'))._tag);

      searchBox().value = 'original';
      saytTag.update({
        queries: [
          { value: 'four' },
          { value: 'five' }
        ]
      });
      while (!(saytTag.root.querySelector('gb-sayt-link')));

      (<HTMLElement>saytTag.root.querySelectorAll('gb-sayt-link a')[1]).click();
    });

    it('does the same thing as clicking when you make .active a suggestion and press enter', (done) => {
      flux = mixinFlux({
        config: { tags: { sayt: { minimumCharacters: 1, delay: 0 } } }
      });
      const tag = mount();
      const saytTag: Sayt = <Sayt>((<any>html.querySelector('gb-sayt'))._tag);

      saytTag.update({
        queries: [
          { value: 'four' }
        ]
      });

      while (!(saytTag.root.querySelector('gb-sayt-link')));

      html.querySelector('gb-sayt-link')['_tag'].update({
        opts: {
          send: () => done()
        }
      });

      dispatchKeydownEvent(searchBox(), KEY_DOWN);
      dispatchKeydownEvent(searchBox(), KEY_ENTER);
    });

    it('does a search of a suggested query with a category refinement when you click', (done) => {
      flux = mixinFlux({
        config: { tags: { sayt: { minimumCharacters: 1, delay: 0 } } }
      });
      const tag = mount();
      const saytTag: Sayt = <Sayt>((<any>html.querySelector('gb-sayt'))._tag);
      saytTag.refine = (target, query) => {
        expect(target.parentNode.dataset['refinement']).to.eq('the category');
        done();
      };

      searchBox().value = 'original';
      saytTag.update({
        categoryResults: [
          { value: 'four', category: 'the category' }
        ],
        // This is necessary in order to have autocopmlete be visible
        queries: ['four']
      });
      while (!(saytTag.root.querySelector('gb-sayt-link')));

      (<HTMLElement>saytTag.root.querySelectorAll('gb-sayt-link a')[0]).click();
    });

    it('does a refinement search when you click', (done) => {
      flux = mixinFlux({
        config: { tags: { sayt: { minimumCharacters: 1, delay: 0 } } }
      });
      const tag = mount();
      const saytTag: Sayt = <Sayt>((<any>html.querySelector('gb-sayt'))._tag);
      saytTag.refine = (target, query) => {
        expect(query).to.eq('');
        expect(target.parentNode.dataset['field']).to.eq('brand000');
        expect(target.parentNode.dataset['value']).to.eq('Brand: 3');
        expect(target.parentNode.dataset['refinement']).to.eq('3');
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

      while (!(saytTag.root.querySelector('gb-sayt-link')));

      (<HTMLElement>saytTag.root.querySelectorAll('gb-sayt-link a')[3]).click();
    });

    it('show navigations when there are no queries', (done) => {
      flux = mixinFlux({
        config: { tags: { sayt: { minimumCharacters: 1, delay: 0 } } }
      });
      const tag = mount();
      const saytTag: Sayt = <Sayt>((<any>html.querySelector('gb-sayt'))._tag);
      saytTag.update({
        navigations: [{
          values: [{}, {}, {}]
        }]
      });
      while (!(saytTag.root.querySelector('gb-sayt-link')));
      expect(saytTag.root.querySelectorAll('gb-sayt-link').length).to.eql(3);
      done();
    });
  });

  function dispatchKeydownEvent(target: EventTarget, keyCode: number) {
    const event = Object.assign(new Event('keydown'), { keyCode });
    target.dispatchEvent(event);
  }

  function searchBox() {
    return html.querySelector('input');
  }

  function mount(autoSearch: boolean = true) {
    return <Query>riot.mount(html, TAG, { sayt: true, autoSearch })[0];
  }
});
