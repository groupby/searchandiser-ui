import { Breadcrumbs, DEFAULT_CONFIG } from '../../src/tags/breadcrumbs/gb-breadcrumbs';
import suite, { BaseModel } from './_suite';
import { expect } from 'chai';

suite<Breadcrumbs>('gb-breadcrumbs', ({ flux, mount, stub, itMountsTag }) => {

  itMountsTag();

  describe('render', () => {
    it('should not render query-crumb queries', () => {
      const tag = mount();
      const model = new Model(tag);

      expect(model.originalQuery).to.not.be.ok;
      expect(model.correctedQuery).to.not.be.ok;
    });

    it('should not render refinement crumbs', () => {
      const tag = mount();
      const model = new Model(tag);

      expect(model.navigationList).to.be.ok;
      expect(model.navigationCrumbs).to.have.length(0);
      expect(model.refinementCrumbs()).to.have.length(0);
    });
  });

  describe('render with query', () => {
    const ORIGINAL_QUERY = 'red sneakres';
    const CORRECTED_QUERY = 'red sneakers';
    let tag: Breadcrumbs;
    let model: Model;

    beforeEach(() => {
      tag = mount();
      model = new Model(tag);
      tag.updateQueryState(<any>{ originalQuery: ORIGINAL_QUERY, correctedQuery: CORRECTED_QUERY });
    });

    it('should render query-crumb', () => {
      expect(model.queryCrumb).to.be.ok;
    });

    it('should render query-crumb originalQuery and correctedQuery', () => {
      expect(model.originalQuery.textContent).to.eq(ORIGINAL_QUERY);
      expect(model.correctedQuery.textContent).to.eq(CORRECTED_QUERY);
    });

    it('should not render query-crumb originalQuery if empty query', () => {
      tag.updateQueryState(<any>{ originalQuery: '', correctedQuery: '' });

      expect(model.originalQuery).to.not.be.ok;
      expect(model.correctedQuery).to.not.be.ok;
    });

    it('should not render query-crumb if configured', () => {
      tag.$config.hideQuery = true;

      tag.update();

      expect(model.queryCrumb).to.not.be.ok;
    });

    describe('render with labels', () => {
      it('should render with defaults', () => {
        expect(model.labels[0].textContent).to.eq(DEFAULT_CONFIG.noResultsLabel);
        expect(model.labels[1].textContent).to.eq(DEFAULT_CONFIG.correctedResultsLabel);

        tag.updateQueryState(<any>{ originalQuery: ORIGINAL_QUERY });
        expect(model.labels[0].textContent).to.eq(DEFAULT_CONFIG.resultsLabel);
      });

      it('should not render', () => {
        tag.$config = { labels: false };

        tag.update();

        expect(model.labels).to.have.length(0);
      });

      it('should render configured labels', () => {
        const noResultsLabel = 'No available results for: ';
        const correctedResultsLabel = 'Here are the results for: ';
        const resultsLabel = 'Showing current results for: ';
        tag.$config = {
          noResultsLabel,
          correctedResultsLabel,
          resultsLabel,
          labels: true
        };

        tag.update();
        expect(model.labels[0].textContent).to.eq(noResultsLabel);
        expect(model.labels[1].textContent).to.eq(correctedResultsLabel);

        tag.updateQueryState(<any>{ originalQuery: ORIGINAL_QUERY });
        expect(model.labels[0].textContent).to.eq(resultsLabel);
      });
    });
  });

  describe('render with refinements', () => {
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
    let tag: Breadcrumbs;
    let model: Model;

    beforeEach(() => {
      tag = mount();
      model = new Model(tag);
      tag.updateQueryState(<any>{ originalQuery: '', selectedNavigation: SELECTED });
    });

    it('renders a list of navigations', () => {
      expect(model.navigationCrumbs).to.have.length(2);
    });

    it('renders each navigation as a list of refinements', () => {
      const navigations = model.navigationCrumbs;
      expect(model.refinementCrumbs()).to.have.length(6);
      expect(model.refinementCrumbs(navigations[0])).to.have.length(3);
      expect(model.refinementCrumbs(navigations[1])).to.have.length(3);
    });

    it('should reset on clearRefinements()', () => {
      tag.clearRefinements();

      expect(model.navigationCrumbs).to.have.length(0);
    });

    it('should not render refinements if configured', () => {
      tag.$config.hideRefinements = true;

      tag.update();

      expect(model.navigationList).to.not.be.ok;
    });

    describe('gb-refinement-crumb', () => {
      it('should set a label for the link', () => {
        expect(model.refinementLinks()[0]).to.be.ok;
        expect(model.refinementLabels()[0].textContent).to.eq('First: A');
        expect(model.refinementLabels()[4].textContent).to.eq('Second: 20 - 54');
      });

      it('should unrefine on click', () => {
        const refinement = { type: 'Value', value: 'B', navigationName: 'first' };
        const unrefine = stub(flux(), 'unrefine');

        model.refinementLinks()[1].click();

        expect(unrefine).to.have.been.calledWith(refinement);
      });
    });
  });
});

export class Model extends BaseModel<Breadcrumbs> {

  get queryCrumb() {
    return this.element(this.html, 'gb-query-crumb');
  }

  get originalQuery() {
    return this.element(this.queryCrumb, '.gb-original-query');
  }

  get correctedQuery() {
    return this.element(this.queryCrumb, '.gb-corrected-query');
  }

  get labels() {
    return this.queryCrumb.querySelectorAll('.gb-query-label');
  }

  get navigationList() {
    return this.element(this.html, 'gb-list > ul');
  }

  get navigationCrumbs() {
    return this.list(this.html, 'gb-list gb-list.gb-navigation-crumb');
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
