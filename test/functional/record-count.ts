import { RecordCount } from '../../src/tags/record-count/gb-record-count';
import suite from './_suite';
import { expect } from 'chai';

suite<RecordCount>('gb-record-count', ({ html, mount }) => {
  beforeEach(() => {
    const template = document.createElement('div');
    template.innerHTML = '{ first } - { last } of { total } Products';
    html().appendChild(template);
  });

  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html().querySelector('div')).to.be.ok;
  });

  it('renders template', () => {
    const tag = mount();
    tag.updatePageInfo({
      pageInfo: {
        recordStart: 10,
        recordEnd: 40
      },
      totalRecordCount: 300
    });

    expect(tag.root.textContent).to.eq('10 - 40 of 300 Products');
  });
});
