import { Breadcrumbs } from '../../src/tags/breadcrumbs/gb-breadcrumbs';
import suite from './_suite';
import { expect } from 'chai';

suite<Breadcrumbs>('gb-breadcrumbs', ({ tagName, flux, html, mount }) => {
  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html().querySelector(`div.${tagName}`)).to.be.ok;
  });

  describe('with query', () => {
    const originalQuery = 'red sneakers';

    it('renders from query changing', () => {
      const tag = mount();

      expect(queryCrumb()).to.not.be.ok;
      tag.updateQuery(originalQuery);
      expect(queryCrumb().textContent).to.eq(originalQuery);
    });
  });

  describe('with refinements', () => {
    const selected = [
      {
        name: 'first',
        displayName: 'First',
        refinements: [
          { type: 'Value', value: 'A' },
          { type: 'Value', value: 'B' },
          { type: 'Value', value: 'C' }
        ]
      }
    ];

    it('renders from refinements changing', () => {
      const tag = mount();

      tag.updateRefinements(selected);
      expect(html().querySelectorAll('.gb-navigation-crumb').length).to.eq(1);
      expect(crumbs().length).to.eq(3);
      expect(crumbs()[1].querySelector('b').textContent).to.eq('First: B');
    });

    it('renders from reset', () => {
      const tag = mount();

      tag.clearRefinements();
      expect(tag['selected'].length).to.eq(0);
      expect(html().querySelectorAll('.gb-nav-crumb').length).to.eq(0);
    });

    it('unrefines on click', () => {
      const tag = mount();

      flux().unrefine = (refinement): any =>
        expect(refinement).to.eql({ type: 'Value', value: 'B', navigationName: 'first' });

      tag.updateRefinements(selected);
      (<HTMLAnchorElement>crumbs()[1].querySelector('a')).click();
    });
  });

  function queryCrumb() {
    return <HTMLLIElement>html().querySelector('.gb-query-crumb');
  }

  function crumbs() {
    return <NodeListOf<HTMLLIElement>>html().querySelectorAll('.gb-navigation-crumb gb-refinement-crumb');
  }
});
