import { FluxTag } from '../../src/tags/tag';
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

export function expectAliases(func: Function, tag: FluxTag<any>, aliasList: string | string[], object?: any) {
  tag.alias = (aliases, obj) => {
    expect(aliases).to.eql(aliasList);
    if (object) {
      expect(obj).to.eq(object);
    } else {
      expect(obj).to.be.undefined;
    }
  };

  func();
}
