/// <reference path="../typings/index.d.ts" />

import { FluxCapacitor, Events, Results } from 'groupby-api';
import { expect } from 'chai';
import { mockFlux } from './fixtures';
import '../src/tags/query/gb-raw-query.tag';

const TAG = 'gb-raw-query';

describe('gb-raw-query tag', () => {
  let html: HTMLInputElement;
  beforeEach(() => {
    document.body.appendChild(html = document.createElement('input'));
    html.type = 'text';
    html.value = 'original';
  });
  afterEach(() => document.body.removeChild(html));

  it('mounts tag', () => {
    const tag = mount();
    expect(tag).to.be.ok;
    expect(html).to.be.ok;
    expect(html.type).to.eq('text');
    expect(html.value).to.eq('original');
  });

  it('should register for rewrite_query', (done) => {
    mount({
      on: (event) => {
        expect(event).to.eq(Events.REWRITE_QUERY);
        done();
      }
    });
  });

  it('should rewrite query on rewrite_query', (done) => {
    mount({ on: (event, cb) => cb('rewritten') })
      .on('updated', () => {
        expect(html.value).to.eq('rewritten');
        done();
      });
  });

  it('should register for input', (done) => {
    sinon.stub(html, 'addEventListener', (event, cb) => {
      expect(event).to.eq('input');
      cb();
    });
    mount({
      reset: (query) => {
        expect(query).to.eq('original');
        done();
      }
    });
  });

  describe('redirect when autoSearch off', () => {
    beforeEach(() => sinon.stub(html, 'addEventListener', (event, cb) => {
      expect(event).to.eq('keydown');
      cb({ keyCode: 13 });
    }));

    it('should register for keydown', (done) => {
      sinon.stub(window.location, 'replace', (url) => {
        expect(url).to.eq('search?q=original');
        done();
      });
      mount({
        reset: (query) => {
          expect(query).to.eq('original');
          done();
        }
      }, { sayt: false, autoSearch: false });
    });

    it('should customise search URL', (done) => {
      sinon.stub(window.location, 'replace', (url) => {
        expect(url).to.eq('/productSearch?query=original');
        done();
      });
      mount({
        reset: (query) => {
          expect(query).to.eq('original');
          done();
        }
      }, { sayt: false, autoSearch: false, searchUrl: '/productSearch', queryParam: 'query' });
    });
  });
});

function mount(options: any = {}, overrides: { sayt?: boolean, autoSearch?: boolean, searchUrl?: string, queryParam?: string } = { sayt: false }): Riot.Tag.Instance {
  return riot.mount('input', TAG, Object.assign({ flux: mockFlux(options) }, overrides))[0];
}
