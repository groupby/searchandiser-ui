import { Reset } from '../../src/tags/reset/gb-reset';
import '../../src/tags/reset/gb-reset.tag';
import suite from './_suite';
import { expect } from 'chai';

suite<Reset>('gb-reset', ({ flux, html, mount }) => {
  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html().querySelector('.gb-reset')).to.be.ok;
    expect(html().querySelector('.gb-reset').textContent).to.eq('×');
  });

  it('should clear query', (done) => {
    const tag = mount();
    tag.searchBox = <HTMLInputElement & any>{ value: 'old' };

    flux().reset = () => done();

    tag.root.click();
  });
});
