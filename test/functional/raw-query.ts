import { FluxCapacitor, Events, Results } from 'groupby-api';
import { expect } from 'chai';
import { mixinFlux, createTag, removeTag } from '../utils/tags';
import { Query } from '../../src/tags/query/gb-query';
import '../../src/tags/query/gb-raw-query.tag';

const TAG = 'gb-raw-query';

describe(`${TAG} tag`, () => {
  let html: HTMLInputElement,
    flux: FluxCapacitor,
    sandbox: Sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    flux = mixinFlux();
    html = <HTMLInputElement>createTag('input');
    html.type = 'text';
    html.value = 'original';
  });
  afterEach(() => {
    sandbox.restore();
    removeTag(html);
  });

  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(document.querySelector('input[riot-tag="gb-raw-query"]')).to.be.ok;
  });

  it('should rewrite query on rewrite_query', () => {
    const tag = mount(),
      query = 'rewritten';

    tag.rewriteQuery(query);
    expect(html.value).to.eq(query);
  });

  describe('redirect when autoSearch off', () => {
    beforeEach(() => sandbox.stub(html, 'addEventListener', (event, cb) => {
      expect(event).to.eq('keydown');
      cb({ keyCode: 13 });
    }));

    it('should register for keydown', (done) => {
      sandbox.stub(window.location, 'replace', (url) => {
        expect(url).to.eq('search?q=original');
        done();
      });

      flux.reset = (query): any => {
        expect(query).to.eq('original');
        done();
      };

      mount(false);
    });

    it('should customise search URL', (done) => {
      sandbox.stub(window.location, 'replace', (url) => {
        expect(url).to.eq('/productSearch?query=original');
        done();
      });

      flux.reset = (query): any => {
        expect(query).to.eq('original');
        done();
      };

      mount(false);
    });
  });

  function mount(autoSearch: boolean = true) {
    return <Query>riot.mount(html, TAG, { sayt: false, autoSearch })[0];
  }
});
