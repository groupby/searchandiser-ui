import { FluxCapacitor, Events, Results } from 'groupby-api';
import { expect } from 'chai';
import { DidYouMean } from '../../src/tags/did-you-mean/gb-did-you-mean';
import '../../src/tags/did-you-mean/gb-did-you-mean.tag';

const TAG = 'gb-did-you-mean';

describe(`${TAG} tag`, () => {
  let html: Element,
    flux: FluxCapacitor;

  beforeEach(() => {
    riot.mixin('test', { flux: flux = new FluxCapacitor('') });
    document.body.appendChild(html = document.createElement(TAG));
  });
  afterEach(() => document.body.removeChild(html));

  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html.querySelector(`ul.${TAG}`)).to.be.ok;
  });

  describe('render behaviour', () => {
    const didYouMeans = ['first', 'second', 'third'];

    it('renders from results', () => {
      const tag = mount();

      tag.updateDidYouMean(didYouMeans);
      expect(dymLinks().length).to.eq(3);
      expect(dymLinks()[0].textContent).to.eq(didYouMeans[0]);
    });

    it('rewrites on option selected', () => {
      const tag = mount();

      flux.rewrite = (query): any => expect(query).to.eq(didYouMeans[1]);

      tag.updateDidYouMean(didYouMeans);
      tag.on('updated', () => dymLinks()[1].click());
    });
  });

  function dymLinks(): NodeListOf<HTMLAnchorElement> {
    return <NodeListOf<HTMLAnchorElement>>html.querySelectorAll('li > a');
  }

  function mount() {
    return <DidYouMean>riot.mount(TAG)[0];
  }
});
