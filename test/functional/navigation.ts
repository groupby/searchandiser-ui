import { Navigation } from '../../src/tags/navigation/gb-navigation';
import * as utils from '../../src/utils/common';
import suite, { BaseModel } from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite<Navigation>('gb-navigation', ({
  flux, html, mount, stub,
  itMountsTag
}) => {

  itMountsTag();

  describe('render', () => {
    it('should render side-nav', () => {
      mount();

      expect(html().querySelector('.gb-side-nav')).to.be.ok;
    });
  });

  describe('render with refinements', () => {
    const NAVIGATIONS = [{
      displayName: 'Main',
      refinements: [
        { value: 'Pick up', type: 'Value', count: 12345 },
        { value: 'Deliver', type: 'Value', count: 123 }
      ]
    }, {
      displayName: 'Category',
      refinements: [
        { value: 'Health', type: 'Value', count: 200 },
        { value: 'Items', type: 'Value', count: 59234 }
      ],
      selected: [{ value: 'Grocery', type: 'Value', count: 52 }]
    }];
    let tag: Navigation;
    let model: Model;

    beforeEach(() => {
      tag = mount();
      model = new Model(tag);
      tag.update({ processed: NAVIGATIONS });
    });

    it('should render refinements', () => {
      expect(html().querySelector('gb-refinement-list')).to.be.ok;
      expect(html().querySelector('gb-available-refinement')).to.be.ok;
      expect(html().querySelector('gb-selected-refinement')).to.be.ok;
      expect(html().querySelectorAll('.gb-navigation-title')[0].textContent).to.eq('Main');
      expect(html().querySelectorAll('.gb-ref__title')[0].textContent).to.eq('Pick up');
      expect(html().querySelectorAll('gb-badge span')[0].textContent).to.eq('12345');
      expect(html().querySelectorAll('.gb-ref__title')[1].textContent).to.eq('Deliver');
      expect(html().querySelectorAll('gb-badge span')[1].textContent).to.eq('123');
      expect(html().querySelectorAll('.gb-navigation-title')[1].textContent).to.eq('Category');
      expect(html().querySelectorAll('.gb-ref__title')[2].textContent).to.eq('Health');
      expect(html().querySelectorAll('gb-badge span')[2].textContent).to.eq('200');
      expect(html().querySelectorAll('.gb-ref__title')[3].textContent).to.eq('Items');
      expect(html().querySelectorAll('gb-badge span')[3].textContent).to.eq('59234');
      expect(html().querySelector('.gb-ref__value').textContent).to.eq('Grocery');
    });

    describe('refine()', () => {
      it('should select refinement on click', () => {
        const refinement = { value: 'Deliver', type: 'Value', count: 123 };
        const toRefinement = stub(utils, 'toRefinement');

        model.refinementTitles[1].click();

        expect(toRefinement.calledWith(refinement)).to.be.true;
      });

      it('should display selected refinement', () => {
        const navigation = {
          displayName: 'Other',
          refinements: [
            { value: 'Random', type: 'Value', count: 888 }]
        };
        const refine = stub(flux(), 'refine', (refinement) =>
          flux().emit(Events.RESULTS, {
            availableNavigation: [navigation],
            selectedNavigation: [{ displayName: 'Main', refinements: [refinement] }]
          }));
        tag.processed = <any>[
          navigation,
          {
            displayName: 'Main',
            refinements: [
              { value: 'Pick up', type: 'Value', count: 12345 },
              { value: 'Deliver', type: 'Value', count: 123 }
            ]
          }
        ];
        tag.update();

        expect(model.selectedRefinement).to.not.be.ok;
        expect(model.refinementTitles[0].textContent).to.eq('Random');
        expect(refine.called).to.be.false;

        model.refinementTitles[1].click();

        expect(model.refinementTitles[0].textContent).to.eq('Random');
        expect(model.selectedRefinement).to.be.ok;
        expect(refine.called).to.be.true;
      });
    });

    describe('unrefine()', () => {
      it('should remove selected refinements on click', () => {
        const refinement = { value: 'Grocery', type: 'Value', count: 52 };
        const toRefinement = stub(utils, 'toRefinement');
        tag.processed = <any>[{
          displayName: 'Main',
          refinements: [
            { value: 'Pick up', type: 'Value', count: 12345 },
            { value: 'Deliver', type: 'Value', count: 123 }
          ],
          selected: [{ value: 'Grocery', type: 'Value', count: 52 }]
        }];
        tag.update();

        (<HTMLAnchorElement>html().querySelector('.gb-ref__link')).click();

        expect(toRefinement.calledWith(refinement)).to.be.true;
      });

      it('should remove unselected refinement from display', () => {
        const navigation = {
          displayName: 'Main',
          name: 'main',
          refinements: [
            { value: 'Pick up', type: 'Value', count: 12345 },
            { value: 'Deliver', type: 'Value', count: 123 }
          ]
        };
        const unrefine = stub(flux(), 'unrefine', (refinements) =>
          flux().emit(Events.RESULTS, {
            availableNavigation: [
              navigation,
              { displayName: 'Other', name: 'other', refinements: [refinements] }
            ],
            selectedNavigation: []
          }));
        tag.processed = <any>[
          navigation,
          {
            displayName: 'Other',
            name: 'other',
            selected: [{ value: 'Random', type: 'Value', count: 888 }]
          }
        ];
        tag.update();

        expect(model.selectedRefinement).to.be.ok;
        expect(html().querySelector('gb-selected-refinement .gb-ref__value').textContent).to.eq('Random');
        expect(unrefine.called).to.be.false;

        (<HTMLAnchorElement>html().querySelector('gb-selected-refinement .gb-ref__link')).click();

        expect(model.selectedRefinement).to.not.be.ok;
        expect(html().querySelectorAll('gb-available-refinement .gb-ref__title')[2].textContent).to.eq('Random');
        expect(unrefine.called).to.be.true;
      });
    });

    describe('more refinements', () => {
      it('should have more refinements link present', () => {
        tag.processed = <any>[{ moreRefinements: true }];

        tag.update();

        expect(model.moreRefinementsLink).to.be.ok;
      });

      it('should not have more refinements link present', () => {
        tag.processed = <any>[{}];

        tag.update();

        expect(model.moreRefinementsLink).to.not.be.ok;
      });
    });

    it('should show more refinements on click', () => {
      const refinements = stub(flux(), 'refinements', () =>
        flux().emit(Events.REFINEMENT_RESULTS, {
          navigation: {
            name: 'main', displayName: 'Main',
            refinements: [
              { value: 'Pick up', type: 'Value', count: 12345 },
              { value: 'Deliver', type: 'Value', count: 123 },
              { value: 'Third', type: 'Value', count: 3 }
            ],
          }
        }));
      tag.processed = <any>[{ name: 'main', moreRefinements: true }];
      tag.update();

      expect(model.refinementTitles[2]).to.not.be.ok;

      model.moreRefinementsLink.click();

      expect((<any>tag.processed[0]).moreRefinements).to.be.false;
      expect(model.refinementTitles[2].textContent).to.eq('Third');
      expect(refinements.calledWith('main'));
    });
  });
});

class Model extends BaseModel<Navigation> {

  get refinementTitles() {
    return this.list(this.html, '.gb-ref__title');
  }

  get selectedRefinement() {
    return this.element(this.html, 'gb-selected-refinement');
  }

  get moreRefinementsLink() {
    return this.element(this.html, '.gb-more-refinements a');
  }
}
