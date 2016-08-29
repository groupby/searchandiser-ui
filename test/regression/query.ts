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

  it('should not error when query contains a backslash', () => {
    flux = mixinFlux({
      config: {
        tags: {
          sayt: {}
        }
      }
    });

    const tag = <Query>riot.mount(html, TAG, { sayt: true, autoSearch: false })[0];
    const saytTag = (<any>html.querySelector('gb-sayt'))._tag;

    saytTag.originalQuery = 'p\\';

    const f = () => saytTag.highlightCurrentQuery('pop', '<b>$&</b>');
    expect(f).to.not.throw(SyntaxError);
    expect(f()).to.not.be.undefined;
  });

  function searchBox() {
    return html.querySelector('input');
  }

  function mount(autoSearch: boolean = true) {
    return <Query>riot.mount(html, TAG, { sayt: false, autoSearch })[0];
  }
});
