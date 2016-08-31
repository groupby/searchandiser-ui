import { Raw } from '../../../src/tags/raw/gb-raw';
import { fluxTag } from '../../utils/tags';
import { expect } from 'chai';

describe('gb-raw logic', () => {
  const content = '<div>red sneakers</div>';
  let tag: Raw;

  beforeEach(() => ({ tag } = fluxTag(new Raw(), { opts: { content } })));

  it('should listen for update event', () => {
    tag.on = (event: string, cb) => {
      expect(event).to.be.oneOf(['update', 'mount']);
      expect(cb).to.eq(tag.updateContent);
    };
    tag.init();
  });

  it('should update innerHTML', () => {
    tag.root = <HTMLElement>{ innerHTML: '' };
    tag.init();

    tag.updateContent();

    expect(tag.root.innerHTML).to.eq(content);
  });
});
