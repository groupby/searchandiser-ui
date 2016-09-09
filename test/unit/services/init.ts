import { initServices, startServices } from '../../../src/services/init';
import { Redirect } from '../../../src/services/redirect';
import { expect } from 'chai';

describe('service initialiser', () => {
  it('should initialise all services', () => {
    const flux = { on: () => null };
    const config = { c: 'd' };

    const services = initServices(<any>flux, config);
    expect(services.redirect).to.be.an.instanceof(Redirect);
  });

  it('should start services in map', () => {
    const spy = sinon.spy();
    const services = { a: { init: spy }, b: { init: spy }, c: { init: spy } };

    startServices(services);
    expect(spy.callCount).to.eq(3);
  });
});