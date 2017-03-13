import { SaytRefinements } from '../../../src/tags/sayt/gb-sayt-refinements';
import suite from './_suite';

suite('gb-sayt-refinements', SaytRefinements, ({ tag, expectAliases }) => {

  describe('init()', () => {
    it('should alias navigation', () => {
      const navigation = tag().navigation = { a: 'b' };

      expectAliases(() => tag().init(), { navigation });
    });
  });
});
