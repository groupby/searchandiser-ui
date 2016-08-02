import { FluxCapacitor } from 'groupby-api';
import { expect } from 'chai';
import { mockFlux } from '../fixtures';
import { Breadcrumbs } from '../../src/tags/breadcrumbs/gb-breadcrumbs';
import '../../src/tags/breadcrumbs/gb-breadcrumbs.tag';

const TAG = 'gb-breadcrumbs';

describe('gb-breadcrumbs tag', () => {
  let html: Element;
  const flux = new FluxCapacitor('');
  beforeEach(() => document.body.appendChild(html = document.createElement(TAG)));
  afterEach(() => document.body.removeChild(html));

  it('mounts tag', () => {
    const tag = mount();
    expect(tag).to.be.ok;
    expect(html.querySelector(`ul.${TAG}`)).to.be.ok;
  });

  describe('with query', () => {
    const originalQuery = 'red sneakers';

    it('renders from query changing', () => {
      const tag = mount();
      expect(html.querySelector('.gb-breadcrumbs__query')).to.not.be.ok;
      tag.updateQuery(originalQuery);
      expect(html.querySelector('.gb-breadcrumbs__query').textContent).to.eq(originalQuery);
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
      expect(html.querySelectorAll('.gb-nav-crumb').length).to.eq(1);
      expect(html.querySelectorAll('.gb-nav-crumb .gb-refinement-crumb').length).to.eq(3);
      expect(html.querySelectorAll('.gb-nav-crumb .gb-refinement-crumb b')[1].textContent).to.eq('First: B');
    });

    it('renders from reset', () => {
      const tag = mount();
      tag.clearRefinements();
      expect(tag['selected'].length).to.eq(0);
      expect(html.querySelectorAll('.gb-nav-crumb').length).to.eq(0);
    });

    it('unrefines on click', (done) => {
      const tag = mount();
      tag.updateRefinements(selected);
      flux.unrefine = (refinement): any => {
        expect(refinement).to.eql({ type: 'Value', value: 'B', navigationName: 'first' });
        done();
      };
      (<HTMLAnchorElement>html.querySelectorAll('.gb-nav-crumb .gb-refinement-crumb a')[1]).click();
    });
  });

  function mount() {
    return <Breadcrumbs>riot.mount(TAG, { flux })[0];
  }
});
