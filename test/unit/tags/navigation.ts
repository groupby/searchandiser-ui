import { DEFAULT_CONFIG, Navigation } from '../../../src/tags/navigation/gb-navigation';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-navigation', Navigation, ({
  flux, tag, sandbox,
  expectSubscriptions,
  itShouldConfigure
}) => {

  describe('init()', () => {
    itShouldConfigure(DEFAULT_CONFIG);

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
      const refinements = [{ c: 'd' }];
      const spy =
        tag().update =
        sinon.spy(({ processed }) => expect(processed).to.eq(refinements));
      tag().replaceRefinements = (res): any => {
        expect(res).to.eq(results);
        return refinements;
      };

      tag().updateRefinements(results);

      expect(spy.called).to.be.true;
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
      const stub = sandbox().stub(flux(), 'refine', (ref) =>
        expect(ref).to.eql({
          navigationName: 'price',
          type: 'Range',
          low: 4,
          high: 6
        }));

      tag().send({ type: 'Range', low: 4, high: 6 }, { name: 'price' });

      expect(stub.called).to.be.true;
    });
  });

  describe('remove()', () => {
    it('should unrefine on remove()', () => {
      const stub = sandbox().stub(flux(), 'unrefine', (ref) =>
        expect(ref).to.eql({
          navigationName: 'price',
          type: 'Range',
          low: 4,
          high: 6
        }));

      tag().remove({ type: 'Range', low: 4, high: 6 }, { name: 'price' });

      expect(stub.called).to.be.true;
    });
  });
});
