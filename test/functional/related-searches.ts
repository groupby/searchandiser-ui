import { FluxCapacitor, Events, Results } from 'groupby-api';
import { expect } from 'chai';
import { mixinFlux, createTag, removeTag } from '../utils/tags';
import { RelatedSearches } from '../../src/tags/related-searches/gb-related-searches';
import '../../src/tags/related-searches/gb-related-searches.tag';

const TAG = 'gb-related-searches';

describe(`${TAG} tag`, () => {
  let html: HTMLElement,
    flux: FluxCapacitor;

  beforeEach(() => {
    flux = mixinFlux();
    html = createTag(TAG);
  });
  afterEach(() => removeTag(html));

  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html.querySelector(`gb-list.${TAG}`)).to.be.ok;
  });

  describe('render behaviour', () => {
    const relatedQueries = ['first', 'second', 'third'];

    it('renders from results', () => {
      const tag = mount();

      tag.updatedRelatedQueries(relatedQueries);
      expect(relatedLinks().length).to.eq(3);
      expect(relatedLinks()[0].textContent).to.eq(relatedQueries[0]);
    });

    it('rewrites on option selected', () => {
      const tag = mount();

      flux.rewrite = (query): any => expect(query).to.eq(relatedQueries[1]);

      tag.updatedRelatedQueries(relatedQueries);
      tag.on('updated', () => relatedLinks()[1].click());
    });
  });

  function relatedLinks(): NodeListOf<HTMLAnchorElement> {
    return <NodeListOf<HTMLAnchorElement>>html.querySelectorAll('li > a');
  }

  function mount() {
    return <RelatedSearches>riot.mount(TAG)[0];
  }
});
