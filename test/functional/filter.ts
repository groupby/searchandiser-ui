// import { Filter } from '../../src/tags/filter/gb-filter';
// import suite, { SelectModel } from './_suite';
//
// const MIXIN = { services: { filter: { register: () => null } } };
//
// suite<Filter>('gb-filter', MIXIN, ({
//   flux, html, mount,
//   expect, stub,
//   itMountsTag
// }) => {
//
//   itMountsTag();
//
//   describe('render', () => {
//     it('renders as select', () => {
//       const tag = mount();
//
//       expect(tag.root.querySelector('gb-select')).to.be.ok;
//     });
//   });
//
//   describe('render with navigation', () => {
//     const NAVIGATION = {
//       name: 'brand',
//       refinements: [{ type: 'Value', value: 'DeWalt' }]
//     };
//     let tag: Filter;
//     let model: Model;
//
//     beforeEach(() => {
//       tag = mount();
//       model = new Model(tag);
//       tag.services.filter = <any>{ isTargetNav: () => true, register: () => null };
//       tag.updateValues(<any>{ availableNavigation: [NAVIGATION] });
//     });
//
//     it('should render items', () => {
//       expect(html().querySelector('gb-list')).to.be.ok;
//       expect(model.label.textContent).to.eq('Filter');
//       expect(model.items).to.have.length(1);
//       expect(model.items[0].textContent).to.eq('DeWalt');
//     });
//
//     describe('clear option', () => {
//       it('should not render clear option', () => {
//         expect(model.clearItem).to.not.be.ok;
//       });
//
//       it('should render clear option when selected', () => {
//         model.items[0].click();
//
//         expect(model.clearItem.textContent).to.eq('Unfiltered');
//       });
//
//       it('should call flux.unrefine() on click', (done) => {
//         const unrefine = stub(flux(), 'unrefine');
//         const refine = stub(flux(), 'refine');
//         flux().results = <any>{ availableNavigation: [NAVIGATION] };
//         flux().reset = (): any => {
//           expect(refine).to.be.called;
//           expect(unrefine).to.be.calledWith(tag.selected);
//           done();
//         };
//         model.items[0].click();
//
//         model.clearItem.click();
//       });
//     });
//   });
// });
//
// class Model extends SelectModel { }
