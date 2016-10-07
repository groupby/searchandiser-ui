import { DEFAULT_CONFIG, Snippet } from '../../../src/tags/snippet/gb-snippet';
import suite from './_suite';

suite('gb-snippet', Snippet, ({ tag, expectSubscriptions, itShouldConfigure }) => {

  describe('init()', () => {
    itShouldConfigure(DEFAULT_CONFIG);

    it('should listen for mount', () => {
      expectSubscriptions(() => tag().init(), {
        mount: tag().loadFile
      }, tag());
    });
  });

  describe('loadFile()', () => {

  });
});
