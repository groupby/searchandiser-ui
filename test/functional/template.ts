import { Template } from '../../src/tags/template/gb-template';
import suite, { BaseModel } from './_suite';
import { expect } from 'chai';

suite<Template>('gb-template', ({ mount, itMountsTag }) => {

  itMountsTag();

  describe('render', () => {
    it('should not render inner div', () => {
      const tag = mount();

      expect(tag.root.querySelector('div')).to.not.be.ok;
    });

    it('should render inner div when active', () => {
      const tag = mount();

      tag.update({ isActive: true });

      expect(tag.root.querySelector('div')).to.be.ok;
    });
  });

  describe('render with template', () => {
    it('renders from template', () => {
      const templateName = 'My Template';
      const content = 'something';
      const richContent = '<h1>my content</h1>';
      const tag = mount();
      const model = new Model(tag);
      tag.$config = { target: templateName };

      tag.updateActive(<any>{
        template: {
          name: templateName,
          zones: {
            a: {
              type: 'Content',
              content
            },
            b: {
              type: 'Rich_Content',
              richContent
            },
            c: {
              type: 'Record',
              records: [{ allMeta: { id: '1', title: 'My Record' } }]
            }
          }
        }
      });

      expect(model.contentZones).to.have.length(1);
      expect(model.contentZones[0].textContent).to.eq(content);

      expect(model.richContentZones).to.have.length(1);
      expect(model.richContentZones[0].firstElementChild.innerHTML).to.eq(richContent);

      expect(model.recordZones).to.have.length(1);
      expect(model.recordZones[0].querySelectorAll('gb-product')).to.have.length(1);
    });
  });
});

class Model extends BaseModel<Template> {
  get contentZones() {
    return this.list(this.html, 'gb-content-zone');
  }

  get richContentZones() {
    return this.list(this.html, 'gb-rich-content-zone');
  }

  get recordZones() {
    return this.list(this.html, 'gb-record-zone');
  }
}
