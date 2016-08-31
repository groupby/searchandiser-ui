import { Navigation } from '../../../src/tags/navigation/gb-navigation';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-navigation', Navigation, ({ flux, tag }) => {
  it('should have default values', () => {
    tag().init();

    expect(tag().badge).to.be.true;
    expect(tag().showSelected).to.be.true;
  });

  it('should allow override from opts', () => {
    tag().opts = { badge: false, showSelected: false };
    tag().init();

    expect(tag().badge).to.be.false;
    expect(tag().showSelected).to.be.false;
  });

  it('should listen for flux events', () => {
    flux().on = (event: string, cb: Function): any => {
      expect(event).to.eq(Events.RESULTS);
      expect(cb).to.eq(tag().updateNavigations);
    };

    tag().init();
  });

  it('should process navigations', () => {
    const availableNavigation = [
      { name: 'a', refinements: [{ type: 'Value', value: 'b' }] },
      { name: 'c', refinements: [{ type: 'Value', value: 'b' }] },
      { name: 'e', refinements: [{ type: 'Value', value: 'f' }] }
    ];
    const selectedNavigation = [{ name: 'c', refinements: [{ type: 'Value', value: 'd' }] }];
    const results = <any>{ availableNavigation, selectedNavigation };

    const processed = tag().processNavigations(results);
    expect(processed).to.eql([
      availableNavigation[0],
      Object.assign(availableNavigation[1], { selected: selectedNavigation[0].refinements }),
      availableNavigation[2]
    ]);
  });

  it('should refine on send()', () => {
    flux().refine = (ref): any => expect(ref).to.eql({
      navigationName: 'price',
      type: 'Range',
      low: 4,
      high: 6
    });

    tag().init();

    tag().send({ type: 'Range', low: 4, high: 6 }, { name: 'price' });
  });

  it('should unrefine on remove()', () => {
    flux().refine = (ref): any => expect(ref).to.eql({
      navigationName: 'price',
      type: 'Range',
      low: 4,
      high: 6
    });

    tag().init();

    tag().remove({ type: 'Range', low: 4, high: 6 }, { name: 'price' });
  });
});
