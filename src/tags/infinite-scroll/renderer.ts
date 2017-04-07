import { riot } from '../../utils/common';
import { InfiniteScroll, ScrollAnchor } from './gb-infinite-scroll';

export const ANIMATION_DURATION_MS = 200;
export const RUNWAY_ITEMS_ABOVE = 10;
export const RUNWAY_ITEMS_BELOW = 50;
export const RUNWAY_LENGTH = 2000;

export type AnimationMap = {
  [index: number]: {
    node: HTMLElement,
    delta: number
  }
};

export class Renderer {

  tombstones: riot.TagElement[] = [];
  unusedNodes: riot.TagElement[] = [];
  tombstoneHeight: number;
  tombstoneWidth: number;
  currentPosition: number;
  firstItem: number;
  lastItem: number;

  constructor(public tag: InfiniteScroll) {
    this.tombstoneHeight = tag.tombstoneLayout.height;
    this.tombstoneWidth = tag.tombstoneLayout.width;

    const delta = this.tag.refs.scroller.scrollTop - this.tag.anchorScrollTop;
    this.initAnchorScrollTop(delta);
    this.calculateVisibleItems(delta);
  }

  initAnchorScrollTop(delta: number) {
    if (this.tag.refs.scroller.scrollTop === 0) {
      this.tag.anchor = { index: 0, offset: 0 };
    } else {
      this.tag.anchor = this.getAnchoredItem(this.tag.anchor, delta);
    }
    this.tag.anchorScrollTop = this.tag.refs.scroller.scrollTop;
  }

  calculateVisibleItems(delta: number) {
    const lastScreenItem = this.getAnchoredItem(this.tag.anchor, this.tag.refs.scroller.offsetHeight);

    let firstItem: number;
    if (delta < 0) {
      firstItem = this.tag.anchor.index - RUNWAY_ITEMS_BELOW;
      this.lastItem = this.tag.capRecords(lastScreenItem.index + RUNWAY_ITEMS_ABOVE);
    } else {
      firstItem = this.tag.anchor.index - RUNWAY_ITEMS_ABOVE;
      this.lastItem = this.tag.capRecords(lastScreenItem.index + RUNWAY_ITEMS_BELOW);
    }

    this.firstItem = Math.max(0, firstItem);
  }

  getAnchoredItem(anchor: ScrollAnchor, delta: number): ScrollAnchor {
    if (delta === 0) {
      return anchor;
    }

    const items = this.tag.items;
    let index = anchor.index;
    let tombstones = 0;
    delta += anchor.offset;

    if (delta < 0) {
      while (delta < 0 && index > 0 && items[index - 1].height) {
        delta += items[index - 1].height;
        index--;
      }
      tombstones = Math.max(-index, Math.ceil(Math.min(delta, 0) / this.tombstoneHeight));
    } else {
      while (delta > 0 && index < items.length && items[index].height && items[index].height < delta) {
        delta -= items[index].height;
        index++;
      }
      if (index >= items.length || !items[index].height) {
        tombstones = Math.floor(Math.max(delta, 0) / this.tombstoneHeight);
      }
    }

    index += tombstones;
    delta -= tombstones * this.tombstoneHeight;

    return { index, offset: delta };
  }

  attachToView() {
    this.findUnusedNodes();

    const animations = this.generateNodes();
    this.dropUnusedNodes();
    this.measureNodes();
    this.calculateScrollTop();
    this.calculateCurrentPosition();
    this.preAnimateNodes(animations);
    this.animateNodes(animations);
    this.animateScroller();
    this.collectTombstones(animations);
    this.tag.maybeRequestContent(this);
  }

  findUnusedNodes() {
    const items = this.tag.items;
    for (let i = 0; i < items.length; i++) {
      if (i === this.firstItem) {
        i = this.lastItem - 1;
        continue;
      }

      if (items[i].node) {
        this.sortNode(items[i].node);
      }

      items[i].node = null;
    }
  }

  dropUnusedNodes() {
    while (this.unusedNodes.length) {
      this.tag.refs.scroller.removeChild(this.unusedNodes.pop());
      // TODO: also unmount nodes if mounted
    }
  }

  sortNode(node: riot.TagElement) {
    if (node.classList.contains('tombstone')) {
      this.tombstones.push(node);
      this.tombstones[this.tombstones.length - 1].classList.add('invisible');
    } else {
      this.unusedNodes.push(node);
    }
  }

  measureNodes() {
    this.tag.items.slice(this.firstItem, this.lastItem)
      .filter((item) => item.data && !item.height)
      .forEach((item) => {
        item.height = item.node.offsetHeight;
        item.width = item.node.offsetWidth;
      });
  }

  calculateScrollTop() {
    this.tag.anchorScrollTop = 0;
    this.tag.items.slice(0, this.tag.anchor.index)
      .forEach((item) => this.tag.anchorScrollTop += item.height || this.tombstoneHeight);
    this.tag.anchorScrollTop += this.tag.anchor.offset;
  }

  calculateCurrentPosition() {
    let currentPosition = this.tag.anchorScrollTop - this.tag.anchor.offset;
    let index = this.tag.anchor.index;
    while (index > this.firstItem) {
      currentPosition -= this.tag.items[--index].height || this.tombstoneHeight;
    }
    while (index < this.firstItem) {
      currentPosition += this.tag.items[index++].height || this.tombstoneHeight;
    }
    this.currentPosition = currentPosition;
  }

  preAnimateNodes(animations: AnimationMap) {
    for (let key of Object.keys(animations)) {
      const { node, delta } = animations[key];
      const item = this.tag.items[key];
      item.node.style.transform = `translateY(${this.tag.anchorScrollTop + delta}px) scale(${this.tombstoneWidth / item.width}, ${this.tombstoneHeight / item.height})`; // tslint:disable-line:max-line-length
      item.node.offsetTop; // tslint:disable-line:no-unused-expression
      node.offsetTop; // tslint:disable-line:no-unused-expression
      item.node.style.transition = `transform ${ANIMATION_DURATION_MS}ms`;
    }
  }

  animateNodes(animations: AnimationMap) {
    for (let i = this.firstItem; i < this.lastItem; i++) {
      const item = this.tag.items[i];
      const anim = animations[i];
      if (anim) {
        anim.node.style.transition = `transform ${ANIMATION_DURATION_MS}ms, opacity ${ANIMATION_DURATION_MS}ms`;
        anim.node.style.transform = `translateY(${this.currentPosition}px) scale(${item.width / this.tombstoneWidth}, ${item.height / this.tombstoneHeight})`; // tslint:disable-line:max-line-length
        anim.node.style.opacity = '0';
      }
      if (this.currentPosition !== item.top) {
        if (!anim) {
          item.node.style.transition = '';
        }
        item.node.style.transform = `translateY(${this.currentPosition}px)`;
      }

      item.top = this.currentPosition;
      this.currentPosition += item.height || this.tombstoneHeight;
    }
  }

  animateScroller() {
    this.tag.runwayEnd = Math.max(this.tag.runwayEnd, this.currentPosition + RUNWAY_LENGTH);
    this.tag.refs.runway.style.transform = `translate(0, ${this.tag.runwayEnd}px)`;
    this.tag.refs.scroller.scrollTop = this.tag.anchorScrollTop;
  }

  collectTombstones(animations: AnimationMap) {
    setTimeout(() => {
      for (let key of Object.keys(animations)) {
        const { node } = animations[key];
        node.classList.add('invisible');
        this.tombstones.push(node);
      }
    }, ANIMATION_DURATION_MS);
  }

  generateNodes() {
    const animations: AnimationMap = {};
    for (let i = this.firstItem; i < this.lastItem; i++) {
      while (this.tag.items.length <= i) {
        this.tag.addBlankItem();
      }

      const item = this.tag.items[i];
      if (item.node) {
        if (item.node.classList.contains('tombstone') && item.data) {
          item.node.style.zIndex = '1';
          animations[i] = {
            node: item.node,
            delta: item.top - this.tag.anchorScrollTop
          };
          item.node = null;
        } else {
          continue;
        }
      }

      let node: riot.TagElement;
      if (item.data) {
        node = this.render(item.data, this.unusedNodes.pop());
      } else {
        node = this.getTombstone();
      }

      node.style.position = 'absolute';
      item.top = -1;
      this.tag.refs.scroller.appendChild(node);
      item.node = node;
    }

    return animations;
  }

  getTombstone(): riot.TagElement {
    const tombstone = this.tombstones.pop();
    if (tombstone) {
      tombstone.classList.remove('invisible');
      tombstone.style.transform = '';
      tombstone.style.transition = '';
      return tombstone;
    } else {
      return Renderer.createTombstone(this.tag.config.structure);
    }
  }

  render(data: any, elem?: riot.TagElement) {
    if (!elem) {
      elem = Renderer.createTombstone(this.tag.config.structure);
      elem.classList.remove('tombstone');
    }
    const tag: any = (<riot.TagElement>elem)._tag;
    tag.opts.allMeta = data.allMeta;
    tag.update();

    return elem;
  }

  static createTombstone(structure: any) {
    const node = document.createElement('li');
    riot.mount(node, 'gb-product', {
      structure,
      infinite: true,
      tombstone: true
    });

    return <riot.TagElement & HTMLLIElement>node;
  }
}
