import { Template } from '../../src/tags/template/gb-template';
import '../../src/tags/template/gb-template.tag';
import suite from './_suite';
import { expect } from 'chai';

suite<Template>('gb-template', ({ html, mount }) => {
  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html().querySelector('div')).to.not.be.ok;
  });

  it('renders when active', () => {
    const tag = mount();

    tag.update({ isActive: true });
    expect(html().querySelector('div')).to.be.ok;
  });

  it('renders from template', () => {
    const templateName = 'My Template';
    const content = 'something';
    const richContent = '<h1>my content</h1>';
    const tag = mount();

    tag.target = templateName;
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
            records: [
              {
                allMeta: {
                  id: '1',
                  title: 'My Record'
                }
              }
            ]
          }
        }
      }
    });

    expect(contentZones().length).to.eq(1);
    expect(contentZones()[0].textContent).to.eq(content);

    expect(richContentZones().length).to.eq(1);
    expect(richContentZones()[0].firstElementChild.innerHTML).to.eq(richContent);

    expect(recordZones().length).to.eq(1);
    expect(recordZones()[0].querySelectorAll('gb-product').length).to.eq(1);
  });

  function contentZones() {
    return html().querySelectorAll('gb-content-zone');
  }

  function richContentZones() {
    return html().querySelectorAll('gb-rich-content-zone');
  }

  function recordZones() {
    return html().querySelectorAll('gb-record-zone');
  }
});
