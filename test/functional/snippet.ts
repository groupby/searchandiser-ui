import { Snippet } from '../../src/tags/snippet/gb-snippet';
import suite from './_suite';
import { expect } from 'chai';

suite<Snippet>('gb-snippet', ({ html, mount, tagName }) => {
  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html().querySelector(`div.${tagName}`)).to.be.ok;
  });
});
