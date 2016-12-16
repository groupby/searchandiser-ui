import { DEFAULT_CONFIG, Snippet } from '../../../src/tags/snippet/gb-snippet';
import suite from './_suite';

suite('gb-snippet', Snippet, ({ itShouldConfigure }) => {

  describe('init()', () => {
    itShouldConfigure(DEFAULT_CONFIG);
  });

  describe('loadFile()', () => {
    // TODO: add tests
  });
});
