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
      switch (event) {
        case Events.RESULTS:
          return expect(cb).to.eq(tag().updateNavigations);
        case Events.REFINEMENT_RESULTS:
          return expect(cb).to.eq(tag().updateRefinements);
        default:
          expect.fail();
      }
    };

    tag().init();
  });

  it('should replace refinements', () => {
    tag().processed = <any>[
      {
        name: 'a',
        refinements: [{ type: 'Value', value: 'b' }]
      }, {
        name: 'c',
        refinements: [{ type: 'Value', value: 'b' }],
        selected: [{ type: 'Value', value: 'd' }]
      }, {
        name: 'e',
        refinements: [{ type: 'Value', value: 'f' }]
      }
    ];

    const processed = tag().replaceRefinements(<any>{
      navigation: {
        name: 'e',
        refinements: [
          { type: 'Value', value: 'm' },
          { type: 'Value', value: 'n' }
        ]
      }
    });

    expect(processed.length).to.eq(3);
    expect(processed[2].refinements.length).to.eq(2);
    expect((<any>processed[2].refinements[0]).value).to.eq('m');
    expect((<any>processed[2].refinements[1]).value).to.eq('n');
  });

  it('should process navigations', () => {
    const availableNavigation = [
      { name: 'a', refinements: [{ type: 'Value', value: 'b' }] },
      { name: 'c', refinements: [{ type: 'Value', value: 'b' }] },
      { name: 'e', refinements: [{ type: 'Value', value: 'f' }] }
    ];
    const selectedNavigation = [{ name: 'c', refinements: [{ type: 'Value', value: 'd' }] }];
    const results: any = { availableNavigation, selectedNavigation };

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
