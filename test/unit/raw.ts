import { FluxCapacitor, Events } from 'groupby-api';
import { Raw } from '../../src/tags/raw/gb-raw';
import { expect } from 'chai';

describe('gb-raw logic', () => {
  const content = '<div>red sneakers</div>';
  let raw: Raw;
  beforeEach(() => raw = Object.assign(new Raw(), { opts: { content }, on: () => null }));

  it('should listen for update event', () => {
    raw.on = (event: string, cb) => {
      expect(event).to.be.oneOf(['update', 'mount']);
      expect(cb).to.eq(raw.updateContent);
    };
    raw.init();
  });

  it('should update innerHTML', () => {
    raw.root = <HTMLElement>{ innerHTML: '' };
    raw.init();

    raw.updateContent();

    expect(raw.root.innerHTML).to.eq(content);
  });
});
