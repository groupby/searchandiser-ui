import { Snippet, TYPES } from '../../../src/tags/snippet/gb-snippet';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-snippet', Snippet, ({ tag, spy, expectSubscriptions }) => {

  describe('init()', () => {
    it('should listen for mount', () => {
      expectSubscriptions(() => tag().init(), {
        mount: tag().loadFile
      }, tag());
    });
  });

  describe('onConfigure()', () => {
    it('should call configure()', () => {
      const configure = spy();

      tag().onConfigure(configure);

      expect(configure).to.have.been.calledWith({ types: TYPES });
    });
  });

  describe('loadFile()', () => {
    const URL = 'http://example.com/tag.html';
    let server: Sinon.SinonFakeServer;

    beforeEach(() => {
      server = sinon.fakeServer.create();
      server.autoRespond = true;
    });

    afterEach(() => server.restore());

    it('should not load the string raw', (done) => {
      const responseText = 'my content';
      const update = tag().update = spy();
      server.respondWith([200, {}, responseText]);
      tag().url = URL;

      tag().loadFile()
        .then(() => {
          expect(update).to.have.been.calledWith({ responseText });
          done();
        });
    });

    it('should load the string raw', (done) => {
      const responseText = '<div>my content</div>';
      server.respondWith([200, {}, responseText]);
      tag().root = <any>{};
      tag().url = URL;
      tag().raw = true;

      tag().loadFile()
        .then(() => {
          expect(tag().root.innerHTML).to.eq(responseText);
          done();
        });
    });
  });
});
