import { Navigation } from '../../src/tags/navigation/gb-navigation';
import * as utils from '../../src/utils/common';
import suite, { BaseModel } from './_suite';
import { Events } from 'groupby-api';

suite<Navigation>('gb-navigation', ({
  flux, html, mount,
  expect, stub,
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
      name: 'main',
      displayName: 'Main',
      or: true,
      refinements: [
        { value: 'Pick up', type: 'Value', count: 12345 },
        { value: 'Deliver', type: 'Value', count: 123, selected: true }
      ]
    }, {
        name: 'category',
        displayName: 'Category',
        refinements: [
          { value: 'Health', type: 'Value', count: 200, selected: true },
          { value: 'Items', type: 'Value', count: 59234 }
        ]
      }];
    let tag: Navigation;
    let model: Model;

    beforeEach(() => {
      tag = mount();
      model = new Model(tag);
      tag.update({ processed: NAVIGATIONS });
    });

    it('should render refinements', () => {
      expect(html().querySelector('li[data-is="gb-refinement-list"]')).to.be.ok;
      expect(html().querySelector('#main')).to.be.ok;
      expect(html().querySelector('#category')).to.be.ok;
      expect(html().querySelectorAll('.gb-navigation-title')[0].textContent).to.eq('Main');
      expect(html().querySelectorAll('.gb-navigation-title')[1].textContent).to.eq('Category');
      expect(model.refinements[0].querySelector('.gb-remove-ref')).to.not.be.ok;
      expect(model.refinementTitles[0].textContent).to.eq('Pick up');
      expect(model.refinementInputs[0].type).to.eq('checkbox');
      expect(model.refinementInputs[0].checked).to.be.false;
      expect(model.refinements[0].querySelector('gb-badge span').textContent).to.eq('12345');
      expect(model.refinements[1].querySelector('.gb-remove-ref')).to.not.be.ok;
      expect(model.refinementTitles[1].textContent).to.eq('Deliver');
      expect(model.refinementInputs[1].type).to.eq('checkbox');
      expect(model.refinementInputs[1].checked).to.be.true;
      expect(model.refinements[1].querySelector('gb-badge span')).to.not.be.ok;
      expect(model.refinements[2].querySelector('.gb-remove-ref')).to.be.ok;
      expect(model.refinementTitles[2].textContent).to.eq('Health');
      expect(model.refinementInputs[2].type).to.eq('button');
      expect(model.refinementInputs[2].checked).to.be.true;
      expect(model.refinements[2].querySelector('gb-badge span')).to.not.be.ok;
      expect(model.refinements[3].querySelector('.gb-remove-ref')).to.not.be.ok;
      expect(model.refinementTitles[3].textContent).to.eq('Items');
      expect(model.refinementInputs[3].type).to.eq('button');
      expect(model.refinementInputs[3].checked).to.be.false;
      expect(model.refinements[3].querySelector('gb-badge span').textContent).to.eq('59234');
    });

    it('should hoist selected refinements', () => {
      tag.hoistSelected = true;
      flux().emit(Events.RESULTS, {
        availableNavigation: [{
          name: 'main',
          or: true,
          refinements: [
            { value: 'Pick up', type: 'Value', count: 12345 },
            { value: 'Uber', type: 'Value', count: 512 }
          ]
        }],
        selectedNavigation: [{
          name: 'main',
          refinements: [
            { value: 'Deliver', type: 'Value', count: 123, selected: true },
            { value: 'Absolute', type: 'Value', count: 13, selected: true }
          ]
        }]
      });

      expect(Array.from(model.refinementTitles)
        .map((element) => element.textContent))
        .to.eql(['Absolute', 'Deliver', 'Pick up', 'Uber']);
    });

    describe('refine()', () => {
      it('should select refinement on click', () => {
        const refinement = { value: 'Deliver', type: 'Value', count: 123, selected: true };
        const toRefinement = stub(utils, 'toRefinement');

        model.refinementTitles[1].click();

        expect(toRefinement).to.be.calledWith(refinement);
      });

      it('should display selected refinement', () => {
        const navigation = {
          displayName: 'Other',
          refinements: [{ value: 'Random', type: 'Value', count: 888 }]
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

        expect(model.selectedRefinements).to.have.length(0);
        expect(refine).to.not.have.been.called;

        model.refinementInputs[0].click();

        expect(model.selectedRefinements[0].querySelector('.gb-ref__title').textContent).to.eq('Random');
        expect(refine).to.be.called;
      });
    });

    describe('unrefine()', () => {
      it('should remove selected refinements on click', () => {
        const refinement = { value: 'Grocery', type: 'Value', count: 52, selected: true };
        const navigation: any = {
          displayName: 'Main',
          refinements: [
            { value: 'Pick up', type: 'Value', count: 12345 },
            { value: 'Deliver', type: 'Value', count: 123 },
            refinement
          ]
        };
        const remove = stub(tag, 'remove');
        tag.processed = [navigation];
        tag.update();

        model.refinementInputs[2].click();

        expect(remove).to.be.calledWith(refinement, navigation);
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
            refinements: [{ value: 'Random', type: 'Value', count: 888, selected: true }]
          }
        ];
        tag.update();

        expect(model.selectedRefinements[0].querySelector('.gb-ref__title').textContent).to.eq('Random');

        model.selectedRefinements[0].querySelector('input').click();

        expect(model.selectedRefinements).to.have.length(0);
        // tslint:disable-next-line:max-line-length
        expect(model.availableRefinements[2].querySelector('.gb-ref__title').textContent).to.eq('Random');
        expect(unrefine).to.be.called;
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
      flux().results = <any>{ selectedNavigation: [] };
      const refinements = stub(flux(), 'refinements', () =>
        flux().emit(Events.REFINEMENT_RESULTS, {
          navigation: {
            name: 'main', displayName: 'Main',
            refinements: [
              { value: 'Pick up', type: 'Value', count: 12345 },
              { value: 'Deliver', type: 'Value', count: 123 },
              { value: 'Third', type: 'Value', count: 3 }
            ]
          }
        }));
      tag.processed = <any>[{ name: 'main', moreRefinements: true, selectedNavigation: {} }];
      tag.update();

      expect(model.refinementTitles).to.have.length(0);

      model.moreRefinementsLink.click();

      expect((<any>tag.processed[0]).moreRefinements).to.be.false;
      expect(model.refinementTitles[2].textContent).to.eq('Third');
      expect(refinements).to.be.calledWith('main');
    });
  });
});

class Model extends BaseModel<Navigation> {

  get refinementTitles() {
    return this.list(this.html, '.gb-ref__title');
  }

  get refinements() {
    return this.list(this.html, 'li[data-is="gb-refinement"]');
  }

  get selectedRefinements() {
    return this.list(this.html, 'li.gb-selected[data-is="gb-refinement"]');
  }

  get availableRefinements() {
    return this.list(this.html, 'li[data-is="gb-refinement"]:not(.gb-selected)');
  }

  get moreRefinementsLink() {
    return this.element(this.html, 'gb-more-refinements a');
  }

  get refinementInputs() {
    return this.list<HTMLInputElement>(this.html, '.gb-ref input');
  }
}
