import { RecordCount } from '../../src/tags/record-count/gb-record-count';
import suite from './_suite';

suite<RecordCount>('gb-record-count', ({ html, expect, mount, itMountsTag }) => {

  beforeEach(() => {
    const template = document.createElement('div');
    template.innerHTML = '{ first } - { last } of { total } Products';
    html().appendChild(template);
  });

  itMountsTag();

  describe('render', () => {
    it('should render inner div', () => {
      const tag = mount();

      expect(tag.root.querySelector('div')).to.be.ok;
    });

    it('should render template', () => {
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
});
