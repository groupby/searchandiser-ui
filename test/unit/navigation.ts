import { FluxCapacitor, Events, Navigation as NavigationModel } from 'groupby-api';
import { Navigation } from '../../src/tags/navigation/gb-navigation';
import { expect } from 'chai';

describe('gb-navigation logic', () => {
  let navigation: Navigation;
  let flux: FluxCapacitor;

  beforeEach(() => navigation = Object.assign(new Navigation(), {
    flux: flux = new FluxCapacitor(''),
    opts: {},
    config: {},
    on: () => null
  }));

  it('should have default values', () => {
    navigation.init();

    expect(navigation.badge).to.be.true;
    expect(navigation.showSelected).to.be.true;
  });

  it('should allow override from opts', () => {
    navigation.opts = { badge: false, showSelected: false };
    navigation.init();

    expect(navigation.badge).to.be.false;
    expect(navigation.showSelected).to.be.false;
  });

  it('should listen for flux events', () => {
    flux.on = (event: string, cb: Function): any => {
      expect(event).to.eq(Events.RESULTS);
      expect(cb).to.eq(navigation.updateNavigations);
    };

    navigation.init();
  });

  it('should process navigations', () => {
    const availableNavigation = [{ name: 'a', refinements: [{ type: 'Value', value: 'b' }] }];
    const selectedNavigation = [{ name: 'c', refinements: [{ type: 'Value', value: 'd' }] }];
    const results = <any>{ availableNavigation, selectedNavigation };

    const processed = navigation.processNavigations(results);
    expect(processed).to.eql({
      a: Object.assign({}, availableNavigation[0], { available: availableNavigation[0].refinements }),
      c: Object.assign({}, selectedNavigation[0], { selected: selectedNavigation[0].refinements })
    });
  });
});
