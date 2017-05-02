// import { Filter, FILTER_UPDATED_EVENT } from '../../../src/services/filter';
// import * as serviceInit from '../../../src/services/init';
// import { expectSubscriptions } from '../../utils/expectations';
// import suite from './_suite';
// import { Events, Query } from 'groupby-api';
// import * as groupby from 'groupby-api';
//
// const SERVICES: any = { search: {} };
//
// suite('filter', ({ expect, spy, stub }) => {
//
//   describe('on construction', () => {
//     let service: Filter;
//
//     beforeEach(() => service = new Filter(<any>{}, <any>{}, SERVICES));
//
//     it('should mixin register methods', () => {
//       const lazyMixin = stub(serviceInit, 'lazyMixin');
//
//       service = new Filter(<any>{}, <any>{}, SERVICES);
//
//       expect(lazyMixin).to.be.calledWith(service);
//     });
//
//     it('should extract configuration', () => {
//       const filterConfig = { a: 'b' };
//
//       service = new Filter(<any>{}, <any>{ tags: { filter: filterConfig } }, SERVICES);
//
//       expect(service.filterConfig).to.eq(filterConfig);
//     });
//
//     it('should default to empty configuration', () => {
//       expect(service.filterConfig).to.eql({});
//     });
//   });
//
//   describe('init()', () => {
//     it('should initialize fluxClone', () => {
//       const service = new Filter(<any>{}, <any>{}, SERVICES);
//       const fluxClone = { a: 'b' };
//       const clone = stub(service, 'clone').returns(fluxClone);
//
//       service.init();
//
//       expect(service.fluxClone).to.eq(fluxClone);
//       expect(clone).to.have.been.called;
//     });
//   });
//
//   describe('lazyInit()', () => {
//     it('should listen for results', () => {
//       const flux: any = {};
//       const service = new Filter(flux, <any>{}, SERVICES);
//       service.updateFluxClone = () => null;
//
//       expectSubscriptions(() => service.lazyInit(), {
//         [Events.RESULTS]: {
//           test: (listener) => {
//             const updateFluxClone = service.updateFluxClone = spy();
//
//             listener();
//
//             expect(updateFluxClone).to.be.called;
//           }
//         }
//       }, flux);
//     });
//
//     it('should call updateFluxClone', () => {
//       const service = new Filter(<any>{ on: () => null }, <any>{}, SERVICES);
//       const updateFluxClone = service.updateFluxClone = spy();
//
//       service.lazyInit();
//
//       expect(updateFluxClone).to.be.called;
//     });
//   });
//
//   describe('isTargetNav()', () => {
//     it('should match navigation', () => {
//       const navName = 'Brand';
//       const config: any = { tags: { filter: { field: navName } } };
//       const service = new Filter(<any>{}, config, SERVICES);
//
//       expect(service.isTargetNav(navName)).to.be.true;
//     });
//
//     it('should not match navigation', () => {
//       const config: any = { tags: { filter: { field: 'Brand' } } };
//       const service = new Filter(<any>{}, config, SERVICES);
//
//       expect(service.isTargetNav('Price')).to.be.false;
//     });
//   });
//
//   describe('clone()', () => {
//     it('should return a FluxCapacitor', () => {
//       const customerId = 'test';
//       const config = { collection: 'otherProducts' };
//       const service = new Filter(<any>{}, <any>{ customerId }, <any>{ search: { _config: config } });
//       const mockFlux = { a: 'b' };
//       const fluxCapacitor = stub(groupby, 'FluxCapacitor').returns(mockFlux);
//
//       const fluxClone = service.clone();
//
//       expect(fluxClone).to.eq(mockFlux);
//       expect(fluxCapacitor).to.be.calledWith(customerId, config);
//     });
//   });
//
//   describe('updateFluxClone()', () => {
//     it('should update fluxClone state', (done) => {
//       const parentQuery = 'red sneakers';
//       const service = new Filter(<any>{
//         emit: () => null,
//         query: new Query(parentQuery)
//       }, <any>{}, SERVICES);
//       const search = stub().resolves();
//       const withConfiguration = stub();
//       const withSelectedRefinements = stub();
//       service.fluxClone = <any>{ search, query: { withConfiguration, withSelectedRefinements } };
//
//       service.updateFluxClone()
//         .then(() => {
//           expect(withConfiguration).to.be.calledWith({ refinements: [] });
//           expect(withSelectedRefinements).to.be.calledWith();
//           expect(search.calledWith(parentQuery)).to.be.true;
//           done();
//         });
//     });
//
//     it('should update fluxClone state with refinements', (done) => {
//       const parentQuery = 'red sneakers';
//       const refinement: any = { a: 'b', c: 'd' };
//       const query = new Query(parentQuery).withSelectedRefinements(refinement);
//       const service = new Filter(<any>{ emit: () => null, query }, <any>{}, SERVICES);
//       const search = stub().resolves();
//       const withSelectedRefinements = stub();
//       service.fluxClone = <any>{ search, query: { withSelectedRefinements, withConfiguration: () => null } };
//       service.isTargetNav = () => false;
//
//       service.updateFluxClone()
//         .then(() => {
//           expect(withSelectedRefinements).to.be.calledWith(refinement);
//           expect(search.calledWith(parentQuery)).to.be.true;
//           done();
//         });
//     });
//
//     it('should emit filter_updated event', (done) => {
//       const result = { a: 'b' };
//       const emit = spy();
//       const search = stub().resolves(result);
//       const flux: any = { query: new Query('red sneakers'), emit };
//       const service = new Filter(flux, <any>{}, SERVICES);
//       service.fluxClone = <any>{
//         search,
//         query: { withConfiguration: () => null, withSelectedRefinements: () => null }
//       };
//       service.isTargetNav = () => false;
//
//       service.updateFluxClone()
//         .then(() => {
//           expect(emit).to.be.calledWith(FILTER_UPDATED_EVENT, result);
//           done();
//         });
//     });
//   });
// });
