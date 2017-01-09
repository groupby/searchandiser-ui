import { FluxTag } from '../../src/tags/tag';
import { expect } from 'chai';

export function expectSubscriptions(func: Function, subscriptions: any, emitter: any) {
  const events = Object.keys(subscriptions);
  const listeners = {};

  emitter.on = (event, handler): any => {
    if (events.includes(event)) {
      if (subscriptions[event] === null) {
        listeners[event] = expect(handler).to.be.a('function');
      } else if (typeof subscriptions[event] === 'object' && subscriptions[event].test) {
        listeners[event] = subscriptions[event].test(handler);
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

export function expectAliases(func: Function, tag: FluxTag<any>, aliasMap: { [key: string]: any }) {
  const foundAliases = [];
  const aliasKeys = Object.keys(aliasMap);

  tag.alias = (aliases, obj) => {
    if (!Array.isArray(aliases)) {
      aliases = [aliases];
    }
    foundAliases.push(...aliases);
    aliases.forEach((alias) => {
      if (obj === undefined) {
        expect(tag).to.eq(aliasMap[alias]);
      } else if (aliasKeys.includes(alias)) {
        expect(obj).to.eq(aliasMap[alias]);
      } else {
        expect.fail();
      }
    });
  };

  func();

  expect(foundAliases).to.have.length(aliasKeys.length);
}
