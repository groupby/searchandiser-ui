import { Filter, FILTER_UPDATED_EVENT } from '../../../src/services/filter';
import * as serviceInit from '../../../src/services/init';
import { expectSubscriptions } from '../../utils/expectations';
import suite from './_suite';
import { Events, FluxCapacitor, Query } from 'groupby-api';

suite('filter', ({ expect, spy, stub }) => {

  describe('on construction', () => {
    let service: Filter;

    beforeEach(() => service = new Filter(<any>{}, <any>{}));

    it('should mixin register methods', () => {
      const lazyMixin = stub(serviceInit, 'lazyMixin');

      service = new Filter(<any>{}, <any>{});

      expect(lazyMixin).to.be.calledWith(service);
    });

    it('should initialize flux clone', () => {
      expect(service.fluxClone).to.be.an.instanceof(FluxCapacitor);
    });

    it('should extract configuration', () => {
      const filterConfig = { a: 'b' };
      service = new Filter(<any>{}, <any>{ tags: { filter: filterConfig } });

      expect(service.filterConfig).to.eq(filterConfig);
    });

    it('should default to empty configuration', () => {
      expect(service.filterConfig).to.eql({});
    });
  });

  describe('init()', () => {
    it('should not throw any error', () => {
      expect(() => new Filter(<any>{}, <any>{}).init()).to.not.throw();
    });
  });

  describe('lazyInit()', () => {
    it('should listen for results', () => {
      const flux: any = {};
      const service = new Filter(flux, <any>{});
      service.updateFluxClone = () => null;

      expectSubscriptions(() => service.lazyInit(), {
        [Events.RESULTS]: {
          test: (listener) => {
            const updateFluxClone = service.updateFluxClone = spy();

            listener();

            expect(updateFluxClone).to.be.called;
          }
        }
      }, flux);
    });

    it('should call updateFluxClone', () => {
      const service = new Filter(<any>{ on: () => null }, <any>{});
      const updateFluxClone = service.updateFluxClone = spy();

      service.lazyInit();

      expect(updateFluxClone).to.be.called;
    });
  });

  describe('isTargetNav()', () => {
    it('should match navigation', () => {
      const navName = 'Brand';
      const config: any = { tags: { filter: { field: navName } } };
      const service = new Filter(<any>{}, config);

      expect(service.isTargetNav(navName)).to.be.true;
    });

    it('should not match navigation', () => {
      const config: any = { tags: { filter: { field: 'Brand' } } };
      const service = new Filter(<any>{}, config);

      expect(service.isTargetNav('Price')).to.be.false;
    });
  });

  describe('clone()', () => {
    it('should return a FluxCapacitor', () => {
      const collection = 'otherProducts';
      const service = new Filter(<any>{}, <any>{ collection });

      const fluxClone = service.clone();

      expect(fluxClone).to.be.an.instanceof(FluxCapacitor);
      expect(fluxClone.query.raw.collection).to.eq(collection);
    });
  });

  describe('updateFluxClone()', () => {
    it('should update fluxClone state', (done) => {
      const parentQuery = 'red sneakers';
      const service = new Filter(<any>{
        emit: () => null,
        query: new Query(parentQuery)
      }, <any>{});
      const search = stub(service.fluxClone, 'search').resolves();

      service.updateFluxClone()
        .then(() => {
          expect(service.fluxClone.query.raw.refinements).to.eql([]);
          expect(search.calledWith(parentQuery)).to.be.true;
          done();
        });
    });

    it('should update fluxClone state with refinements', (done) => {
      const parentQuery = 'red sneakers';
      const refinements: any = { a: 'b', c: 'd' };
      const query = new Query(parentQuery).withSelectedRefinements(refinements);
      const service = new Filter(<any>{ emit: () => null, query }, <any>{});
      const search = stub(service.fluxClone, 'search').resolves();
      service.isTargetNav = () => false;

      service.updateFluxClone()
        .then(() => {
          expect(service.fluxClone.query.raw.refinements).to.eql([refinements]);
          expect(search.calledWith(parentQuery)).to.be.true;
          done();
        });
    });

    it('should emit filter_updated event', () => {
      const emit = spy();
      const flux: any = { query: new Query('red sneakers'), emit };
      const result = { a: 'b' };
      const service = new Filter(flux, <any>{});
      stub(service.fluxClone, 'search', () => ({
        then: (cb) => {
          expect(cb).to.be.a('function');
          cb(result);
        }
      }));
      service.isTargetNav = () => false;

      service.updateFluxClone();

      expect(emit).to.be.calledWith(FILTER_UPDATED_EVENT, result);
    });
  });
});
