import { Results } from '../../src/tags/results/gb-results';
import suite from './_suite';
import { expect } from 'chai';

const STRUCT = { title: 'title' };

suite<Results>('gb-results', { config: { structure: STRUCT } }, ({ html, mount }) => {
  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html().querySelector('gb-list')).to.be.ok;
  });

  it('renders from records', () => {
    const tag = mount();

    tag.updateRecords(<any>{ records: [{}, {}, {}] });
    expect(products().length).to.eq(3);
    expect(html().querySelectorAll('gb-list li').length).to.eq(3);
  });

  it('renders product info', () => {
    const title = 'Red Sneakers';
    const tag = mount();

    tag.updateRecords(<any>{ records: [{ allMeta: { title } }] });

    expect(products()[0].querySelector('.gb-product__title').textContent).to.eq(title);
  });

  function products() {
    return html().querySelectorAll('gb-product');
  }
});
