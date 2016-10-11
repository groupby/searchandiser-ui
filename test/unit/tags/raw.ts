import { Raw } from '../../../src/tags/raw/gb-raw';
import suite from './_suite';
import { expect } from 'chai';

const content = '<div>red sneakers</div>';

suite('gb-raw', Raw, { opts: { content } }, ({
  tag,
  expectSubscriptions,
  itShouldConfigure
}) => {

  describe('init()', () => {
    itShouldConfigure();
  });

  it('should listen for events', () => {
    expectSubscriptions(() => tag().init(), {
      update: tag().updateContent,
      mount: tag().updateContent
    }, tag());
  });

  describe('updateContent()', () => {
    it('should update innerHTML', () => {
      tag().root = <any>{ innerHTML: '' };
      tag()._config = { content };

      tag().updateContent();

      expect(tag().root.innerHTML).to.eq(content);
    });
  });
});
