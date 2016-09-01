import { Raw } from '../../src/tags/raw/gb-raw';
import suite from './_suite';
import { expect } from 'chai';

suite<Raw>('gb-raw', ({ html, mount: _mount }) => {
  const content = '<div>red sneakers</div>';

  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html().querySelector('div')).to.be.ok;
  });

  describe('render behaviour', () => {
    it('should not render content as html', () => {
      mount();

      expect(html().querySelector('div').textContent).to.eq('red sneakers');
    });
  });

  function mount() {
    return _mount({ content });
  }
});
