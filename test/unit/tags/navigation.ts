import { META, Navigation } from '../../../src/tags/navigation/gb-navigation';
import { displayRefinement } from '../../../src/utils/common';
import * as common from '../../../src/utils/common';
import { refinement } from '../../utils/fixtures';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-navigation', Navigation, ({
  flux, tag, spy, stub,
  expectSubscriptions,
  itShouldHaveMeta,
  itShouldAlias
}) => {
  itShouldHaveMeta(Navigation, META);

  describe('init()', () => {
    itShouldAlias('navigable');

    it('should mixin toView()', () => {
      const mixin = tag().mixin = spy();

      tag().init();

      expect(mixin).to.be.calledWith({ toView: displayRefinement });
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

      expect(replaceRefinements).to.be.calledWith(results);
      expect(update).to.be.calledWith({ processed });
    });
  });

  describe('replaceRefinements()', () => {
    it('should replace refinements', () => {
      const mergeRefinements = stub(tag(), 'mergeRefinements');
      tag().flux.results = <any>{ selectedNavigation: [] };
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
      expect(mergeRefinements).to.not.be.called;
    });

    it('should not replace refinements', () => {
      tag().processed = [];

      const processed = tag().replaceRefinements(<any>{
        navigation: {
          name: 'e',
          refinements: [{ type: 'Value', value: 'n' }]
        }
      });

      expect(processed).to.have.length(0);
    });

    it('should mark selected refinements', () => {
      const mergeRefinements = stub(tag(), 'mergeRefinements');
      const availableNavigation: any = { name: 'a', refinements: [] };
      const selectedNavigation: any = { name: 'a' };
      tag().flux.results = <any>{ selectedNavigation: [selectedNavigation] };
      tag().processed = [availableNavigation];

      tag().replaceRefinements(<any>{ navigation: { name: 'a' } });

      expect(mergeRefinements).to.be.calledWith(availableNavigation, selectedNavigation);
    });
  });

  describe('processNavigations()', () => {
    it('should clone availableNavigation', () => {
      const availableNavigation = [{ a: 'b' }];
      const processed = [];
      const clone = stub(common, 'clone').returns(processed);

      const actualProcessed = tag().processNavigations(<any>{ availableNavigation, selectedNavigation: [] });

      expect(actualProcessed).to.eq(processed);
      expect(clone).to.be.calledWith(availableNavigation);
    });

    it('should pass matching navigation to mergeRefinements()', () => {
      const available1 = { name: 'a' };
      const available2 = { name: 'b' };
      const selected1 = { name: 'b' };
      const selected2 = { name: 'a' };
      const mergeRefinements = stub(tag(), 'mergeRefinements');

      tag().processNavigations(<any>{
        availableNavigation: [available1, available2],
        selectedNavigation: [selected1, selected2]
      });

      expect(mergeRefinements).to.be.calledTwice;
      expect(mergeRefinements).to.be.calledWith(available1, selected2);
      expect(mergeRefinements).to.be.calledWith(available2, selected1);
    });

    it('orphaned selected navigations should be pushed to the top', () => {
      const selected = { name: 'a', refinements: <any[]>[{}, {}] };

      const processed = tag().processNavigations(<any>{ availableNavigation: [], selectedNavigation: [selected] });

      expect(processed[0]).to.eq(selected);
      selected.refinements.forEach((refinement) => expect(refinement.selected).to.be.true);
    });
  });

  describe.only('mergeRefinements()', () => {
    it('should check for refinement matches', () => {
      const available1 = {};
      const available2 = {};
      const selected1 = {};
      const selected2 = {};
      const refinementMatches = stub(common, 'refinementMatches');

      tag().mergeRefinements(
        {
          refinements: [available1, available2]
        },
        {
          refinements: [selected1, selected2]
        });

      expect(refinementMatches).to.be.calledWith(available1, selected1);
      expect(refinementMatches).to.be.calledWith(available2, selected1);
      expect(refinementMatches).to.be.calledWith(available1, selected2);
      expect(refinementMatches).to.be.calledWith(available2, selected2);
    });

    it('should select matching refinements', () => {
      const available: any = {};
      const selected = {};
      stub(common, 'refinementMatches').returns(true);

      tag().mergeRefinements({ refinements: [available] }, { refinements: [selected] });

      expect(available.selected).to.be.true;
    });

    it('should add orphan selected refinements', () => {
      const availableNavigation = { refinements: [{}] };
      const selected = {};
      stub(common, 'refinementMatches');

      tag().mergeRefinements(availableNavigation, { refinements: [selected] });

      expect(availableNavigation.refinements).to.have.length(2);
      expect(availableNavigation.refinements[0]).to.eq(selected);
    });

    it('should sort the resulting refinements', () => {
      const ref1 = {};
      const ref2 = {};
      const availableNavigation = { refinements: [ref1, ref2] };
      stub(common, 'refinementMatches');

      tag().mergeRefinements(availableNavigation, { refinements: [] });

      expect(availableNavigation.refinements).to.have.length(2);
    });
  });

  describe('sortRefinements()', () => {
    it('should return 1 if neither is selected', () => {
      expect(tag().sortRefinements({}, {})).to.eq(1);
    });

    it('should sort selected to the top', () => {
      expect(tag().sortRefinements({ selected: true }, {})).to.eq(-1);
      expect(tag().sortRefinements({}, { selected: true })).to.eq(1);
    });

    it('should sort within selected by value', () => {
      const ref1 = { selected: true, value: 'b' };
      const ref2 = { selected: true, value: 'a' };

      expect(tag().sortRefinements(ref2, ref1)).to.eq(-1);
      expect(tag().sortRefinements(ref1, ref2)).to.eq(1);
    });
  });

  describe('send()', () => {
    it('should refine on send()', () => {
      const refine = stub(flux(), 'refine');

      tag().send({ type: 'Range', low: 4, high: 6 }, { name: 'price' });

      expect(refine).to.be.calledWith(refinement('price', 4, 6));
    });
  });

  describe('remove()', () => {
    it('should unrefine on remove()', () => {
      const unrefine = stub(flux(), 'unrefine');

      tag().remove({ type: 'Range', low: 4, high: 6 }, { name: 'price' });

      expect(unrefine).to.be.calledWith(refinement('price', 4, 6));
    });
  });
});
