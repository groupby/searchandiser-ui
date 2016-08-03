import { FluxCapacitor, Events, Results } from 'groupby-api';
import { expect } from 'chai';
import { mockFlux } from '../fixtures';
import { DidYouMean } from '../../src/tags/did-you-mean/gb-did-you-mean';
import '../../src/tags/did-you-mean/gb-did-you-mean.tag';

const TAG = 'gb-did-you-mean';

describe('gb-did-you-mean tag', () => {
  let html: Element;
  let flux: FluxCapacitor;
  beforeEach(() => {
    flux = new FluxCapacitor('');
    document.body.appendChild(html = document.createElement(TAG));
  });
  afterEach(() => document.body.removeChild(html));

  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html.querySelector(`ul.${TAG}`)).to.be.ok;
  });

  it('renders from results', () => {
    const tag = mount();

    tag.updateDidYouMean(['first', 'second', 'third']);
    expect(dymLinks().length).to.eq(3);
    expect(dymLinks()[0].textContent).to.eq('first');
  });

  it('rewrites on option selected', () => {
    const tag = mount();

    flux.rewrite = (query): any => expect(query).to.eq('second');

    tag.updateDidYouMean(['first', 'second', 'third']);
    tag.on('updated', () => dymLinks()[1].click());
  });

  function dymLinks(): NodeListOf<HTMLAnchorElement> {
    return <NodeListOf<HTMLAnchorElement>>html.querySelectorAll('li > a');
  }

  function mount() {
    return <DidYouMean>riot.mount(TAG, { flux })[0];
  }
});
