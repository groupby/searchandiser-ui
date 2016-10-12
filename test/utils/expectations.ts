import { expect } from 'chai';

export function expectSubscriptions(func: Function, subscriptions: any, emitter: any) {
  const events = Object.keys(subscriptions);
  const listeners = {};

  emitter.on = (event, handler): any => {
    if (events.includes(event)) {
      if (subscriptions[event] === null) {
        listeners[event] = expect(handler).to.be.a('function');
      } else {
        listeners[event] = expect(handler).to.eq(subscriptions[event]);
      }
    } else {
      expect.fail();
    }
  };

  func();

  const subscribedEvents = Object.keys(listeners);
  expect(subscribedEvents).to.have.members(events);
}
