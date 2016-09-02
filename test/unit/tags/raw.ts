import { Raw } from '../../../src/tags/raw/gb-raw';
import suite from './_suite';
import { expect } from 'chai';

const content = '<div>red sneakers</div>';

suite('gb-raw', Raw, { opts: { content } }, ({ tag }) => {
  it('should listen for update event', () => {
    tag().on = (event: string, cb) => {
      expect(event).to.be.oneOf(['update', 'mount']);
      expect(cb).to.eq(tag().updateContent);
    };
    tag().init();
  });

  it('should update innerHTML', () => {
    tag().root = <HTMLElement>{ innerHTML: '' };
    tag().init();

    tag().updateContent();

    expect(tag().root.innerHTML).to.eq(content);
  });
});
