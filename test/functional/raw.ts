import { Raw } from '../../src/tags/raw/gb-raw';
import suite from './_suite';
import { expect } from 'chai';

function configure() {
  this._config = { content: '<div>red sneakers</div>' };
}

suite<Raw>('gb-raw', { configure }, ({ html, mount }) => {

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
});
