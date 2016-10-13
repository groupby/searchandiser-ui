import { Navigation } from '../../src/tags/navigation/gb-navigation';
import * as utils from '../../src/utils/common';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite<Navigation>('gb-navigation', ({
  flux, html, mount, sandbox,
  itMountsTag
}) => {

  itMountsTag();

  it('renders side-nav', () => {
    mount();

    expect(html().querySelector('.gb-side-nav')).to.be.ok;
  });

  it('renders with refinements', () => {
    const tag = mount();
    const processed = <any>[{
      displayName: 'Main',
      refinements: [
        { value: 'Pick up', type: 'Value', count: 12345 },
        { value: 'Deliver', type: 'Value', count: 123 }]
    }, {
      displayName: 'Category',
      refinements: [
        { value: 'Health', type: 'Value', count: 200 },
        { value: 'Items', type: 'Value', count: 59234 }],
      selected: [{ value: 'Grocery', type: 'Value', count: 52 }]
    }];

    tag.update({ processed });

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

  it('should select refinement on click', () => {
    const tag = mount();
    const stub = sandbox().stub(utils, 'toRefinement', (refinement) =>
      expect(refinement).to.eql({ value: 'Deliver', type: 'Value', count: 123 }));
    const processed = <any>[{
      displayName: 'Main',
      refinements: [
        { value: 'Pick up', type: 'Value', count: 12345 },
        { value: 'Deliver', type: 'Value', count: 123 }]
    }];
    tag.update({ processed });

    (<HTMLAnchorElement>html().querySelectorAll('.gb-ref__title')[1]).click();

    expect(stub.called).to.be.true;
  });

  it('should display selected refinement', () => {
    const tag = mount();
    const navigation = {
      displayName: 'Other',
      refinements: [
        { value: 'Random', type: 'Value', count: 888 }]
    };

    flux().refine = (refinement): any => {
      flux().emit(Events.RESULTS, {
        availableNavigation: [navigation],
        selectedNavigation:
        [{
          displayName: 'Main',
          refinements: [refinement]
        }]
      });
    };

    tag.processed = <any>[
      navigation,
      {
        displayName: 'Main',
        refinements: [
          { value: 'Pick up', type: 'Value', count: 12345 },
          { value: 'Deliver', type: 'Value', count: 123 }]
      }];
    tag.update();

    expect(html().querySelector('gb-selected-refinement')).to.not.be.ok;
    expect(html().querySelector('.gb-ref__title').textContent).to.eq('Random');

    (<HTMLAnchorElement>html().querySelectorAll('.gb-ref__title')[1]).click();

    expect(html().querySelector('.gb-ref__title').textContent).to.eq('Random');
    expect(html().querySelector('gb-selected-refinement')).to.be.ok;
  });

  it('should remove selected refinements on click', () => {
    const tag = mount();
    sandbox().stub(utils, 'toRefinement', (refinement) => {
      expect(refinement).to.eql({ value: 'Grocery', type: 'Value', count: 52 });
    });

    tag.processed = <any>[{
      displayName: 'Main',
      refinements: [
        { value: 'Pick up', type: 'Value', count: 12345 },
        { value: 'Deliver', type: 'Value', count: 123 }],
      selected: [{ value: 'Grocery', type: 'Value', count: 52 }]
    }];
    tag.update();

    (<HTMLAnchorElement>html().querySelector('.gb-ref__link')).click();
  });

  it('should remove unselected refinement from display', () => {
    const tag = mount();
    const navigation = {
      displayName: 'Main',
      name: 'main',
      refinements: [
        { value: 'Pick up', type: 'Value', count: 12345 },
        { value: 'Deliver', type: 'Value', count: 123 }]
    };

    flux().unrefine = (refinements): any => {
      flux().emit(Events.RESULTS, {
        availableNavigation: [navigation, { displayName: 'Other', name: 'other', refinements: [refinements] }],
        selectedNavigation: []
      });
    };

    tag.processed = <any>[
      navigation,
      {
        displayName: 'Other',
        name: 'other',
        selected: [
          { value: 'Random', type: 'Value', count: 888 }]
      }];
    tag.update();

    expect(html().querySelector('gb-selected-refinement')).to.be.ok;
    expect(html().querySelector('gb-selected-refinement .gb-ref__value').textContent).to.eq('Random');

    (<HTMLAnchorElement>html().querySelector('gb-selected-refinement .gb-ref__link')).click();

    expect(html().querySelector('gb-selected-refinement')).to.not.be.ok;
    expect(html().querySelectorAll('gb-available-refinement .gb-ref__title')[2].textContent).to.eq('Random');
  });

  it('should have more refinements link present', () => {
    const tag = mount();

    tag.processed = <any>[{ moreRefinements: true }];
    tag.update();

    expect(html().querySelector('.gb-more-refinements')).to.be.ok;
  });

  it('should not have more refinements link present', () => {
    const tag = mount();

    tag.processed = <any>[{}];
    tag.update();

    expect(html().querySelector('.gb-more-refinements')).to.not.be.ok;
  });

  it('should show more refinements on click', () => {
    const tag = mount();

    flux().refinements = (refName): any => {
      expect(refName).to.eq('main');
      flux().emit(Events.REFINEMENT_RESULTS, {
        navigation: {
          name: 'main', displayName: 'Main',
          refinements: [
            { value: 'Pick up', type: 'Value', count: 12345 },
            { value: 'Deliver', type: 'Value', count: 123 },
            { value: 'Third', type: 'Value', count: 3 }],
        }
      });
    };

    tag.processed = <any>[{
      name: 'main',
      moreRefinements: true
    }];
    tag.update();

    expect(html().querySelectorAll('.gb-ref__title')[2]).to.not.be.ok;
    (<HTMLAnchorElement>html().querySelector('.gb-more-refinements a')).click();
    expect((<any>tag.processed[0]).moreRefinements).to.be.false;
    expect(html().querySelectorAll('.gb-ref__title')[2].textContent).to.eq('Third');
  });
});
