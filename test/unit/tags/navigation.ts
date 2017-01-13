import { Navigation } from '../../../src/tags/navigation/gb-navigation';
import { refinement } from '../../utils/fixtures';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-navigation', Navigation, ({
  flux, tag, spy, stub,
  expectSubscriptions
}) => {

  describe('init()', () => {
    it('should set defaults', () => {
      tag().init();

      expect(tag().badge).to.be.true;
      expect(tag().showSelected).to.be.true;
    });

    it('should set properties from opts', () => {
      tag().opts = { badge: false, showSelected: false };

      tag().init();

      expect(tag().badge).to.be.false;
      expect(tag().showSelected).to.be.false;
    });

    it('should listen for flux events', () => {
      expectSubscriptions(() => tag().init(), {
        [Events.RESULTS]: tag().updateNavigations,
        [Events.REFINEMENT_RESULTS]: tag().updateRefinements
      });
    });
  });

  describe('updateRefinements()', () => {
    it('should call update() with processed', () => {
      const results: any = { a: 'b' };
      const processed = [{ c: 'd' }];
      const update = tag().update = spy();
      const replaceRefinements = stub(tag(), 'replaceRefinements').returns(processed);

      tag().updateRefinements(results);

      expect(replaceRefinements).to.have.been.calledWith(results);
      expect(update).to.have.been.calledWith({ processed });
    });
  });

  describe('replaceRefinements()', () => {
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

      expect(processed).to.have.length(3);
      expect(processed[2].refinements).to.have.length(2);
      expect((<any>processed[2].refinements[0]).value).to.eq('m');
      expect((<any>processed[2].refinements[1]).value).to.eq('n');
    });
  });

  describe('processNavigations()', () => {
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
  });

  describe('send()', () => {
    it('should refine on send()', () => {
      const refine = stub(flux(), 'refine');

      tag().send({ type: 'Range', low: 4, high: 6 }, { name: 'price' });

      expect(refine).to.have.been.calledWith(refinement('price', 4, 6));
    });
  });

  describe('remove()', () => {
    it('should unrefine on remove()', () => {
      const unrefine = stub(flux(), 'unrefine');

      tag().remove({ type: 'Range', low: 4, high: 6 }, { name: 'price' });

      expect(unrefine).to.have.been.calledWith(refinement('price', 4, 6));
    });
  });
});
