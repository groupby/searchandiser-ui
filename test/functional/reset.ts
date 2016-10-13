import { Reset } from '../../src/tags/reset/gb-reset';
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
    tag.searchBox = <any>{ value: 'old' };
    flux().reset = (): any => done();

    tag.root.click();
  });
});
