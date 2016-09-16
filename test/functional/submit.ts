import { Submit } from '../../src/tags/submit/gb-submit';
import suite from './_suite';
import { expect } from 'chai';

suite<Submit>('gb-submit', ({ flux, html, mount }) => {
  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html().querySelector('.gb-submit')).to.be.ok;
    expect(html().querySelector('.gb-submit').textContent).to.eq('🔍');
  });

  it('should reset query', () => {
    const tag = mount();
    tag.searchBox = <any>{ value: 'old' };

    flux().reset = (value): any => expect(value).to.eq('old');

    tag.root.click();
  });
});
