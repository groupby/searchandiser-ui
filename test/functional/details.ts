import { Details } from '../../src/tags/details/gb-details';
import suite from './_suite';
import { expect } from 'chai';

suite<Details>('gb-details', ({ tagName, html, mount }) => {
  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html().querySelector(`div.${tagName}`)).to.be.ok;
  });
});
