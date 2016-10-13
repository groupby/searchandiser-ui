import { Breadcrumbs } from '../../src/tags/breadcrumbs/gb-breadcrumbs';
import suite, { BaseModel } from './_suite';
import { expect } from 'chai';

suite<Breadcrumbs>('gb-breadcrumbs', ({ flux, mount, itMountsTag }) => {

  itMountsTag();

  describe('with query', () => {
    const ORIGINAL_QUERY = 'red sneakers';

    it('should set the textContent of query-crumb', () => {
      const tag = mount();
      const model = new Model(tag);

      tag.updateQuery(ORIGINAL_QUERY);

      expect(model.queryCrumb).to.be.ok;
      expect(model.queryCrumb.textContent).to.eq(ORIGINAL_QUERY);
    });

    it('should not render query-crumb if configured', () => {
      const tag = mount({ hideQuery: true });
      const model = new Model(tag);

      tag.updateQuery(ORIGINAL_QUERY);

      expect(model.queryCrumb).to.not.be.ok;
    });

    it('should not render query-crumb if empty query', () => {
      const tag = mount();
      const model = new Model(tag);

      expect(model.queryCrumb).to.not.be.ok;

      tag.updateQuery('');

      expect(model.queryCrumb).to.not.be.ok;
    });
  });

  describe('with refinements', () => {
    const SELECTED = [
      {
        name: 'first',
        displayName: 'First',
        refinements: [
          { type: 'Value', value: 'A' },
          { type: 'Value', value: 'B' },
          { type: 'Value', value: 'C' }
        ]
      }, {
        name: 'second',
        displayName: 'Second',
        refinements: [
          { type: 'Value', value: 'D' },
          { type: 'Range', low: 20, high: 54 },
          { type: 'Value', value: 'F' }
        ]
      }
    ];

    it('renders list', () => {
      const model = new Model(mount());

      expect(model.navigationList).to.be.ok;
    });

    it('renders as a list of navigations', () => {
      const tag = mount();
      const model = new Model(tag);

      tag.updateRefinements(SELECTED);

      expect(model.navigationList).to.be.ok;
      expect(model.navigationCrumbs).to.have.length(2);
    });

    it('renders each navigation as a list of refinements', () => {
      const tag = mount();
      const model = new Model(tag);

      tag.updateRefinements(SELECTED);

      const navigations = model.navigationCrumbs;
      expect(model.refinementCrumbs()).to.have.length(6);
      expect(model.refinementCrumbs(navigations[0])).to.have.length(3);
      expect(model.refinementCrumbs(navigations[1])).to.have.length(3);
    });

    it('should not render refinements if configured', () => {
      const tag = mount({ hideRefinements: true });
      const model = new Model(tag);

      tag.updateRefinements(SELECTED);

      expect(model.navigationList).to.not.be.ok;
    });

    it('renders from reset', () => {
      const tag = mount();
      const model = new Model(tag);
      tag.updateRefinements(SELECTED);

      expect(model.navigationCrumbs).not.to.have.length(0);

      tag.clearRefinements();

      expect(model.navigationCrumbs).to.have.length(0);
    });

    describe('gb-refinement-crumb', () => {
      it('should set a label for the link', () => {
        const tag = mount();
        const model = new Model(tag);

        tag.updateRefinements(SELECTED);

        expect(model.refinementLinks()[0]).to.be.ok;
        expect(model.refinementLabels()[0].textContent).to.eq('First: A');
        expect(model.refinementLabels()[4].textContent).to.eq('Second: 20 - 54');
      });

      it('should unrefine on click', () => {
        const tag = mount();
        const model = new Model(tag);
        const spy = flux().unrefine = sinon.spy((refinement): any =>
          expect(refinement).to.eql({ type: 'Value', value: 'B', navigationName: 'first' }));
        tag.updateRefinements(SELECTED);

        model.refinementLinks()[1].click();

        expect(spy.called).to.be.true;
      });
    });
  });
});

export class Model extends BaseModel<Breadcrumbs> {

  get queryCrumb() {
    return this.element(this.html, 'div > .gb-query-crumb');
  }

  get navigationList() {
    return this.element(this.html, 'div > gb-list > ul');
  }

  get navigationCrumbs() {
    return this.list(this.html, 'div > gb-list gb-list.gb-navigation-crumb');
  }

  refinementCrumbs(parent: HTMLElement = this.html) {
    return this.list(parent, 'gb-refinement-crumb');
  }

  refinementLinks(parent: HTMLElement = this.html) {
    return this.list<HTMLAnchorElement>(parent, 'gb-refinement-crumb > a');
  }

  refinementLabels(parent: HTMLElement = this.html) {
    return this.list(parent, 'gb-refinement-crumb > b');
  }
}
