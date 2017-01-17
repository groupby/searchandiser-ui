import { FluxTag } from '../../src/tags/tag';
import { expect } from 'chai';

export type ExpectedAliases = { [key: string]: any } | string[] | string;

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

export function expectAliases(func: Function, tag: FluxTag<any>, expectedAliases: ExpectedAliases) {
  if (Array.isArray(expectedAliases)) {
    expectAliasArray(func, tag, <string[]>expectedAliases);
  } else if (typeof expectedAliases === 'string') {
    expectAliasArray(func, tag, [expectedAliases]);
  } else {
    expectAliasMap(func, tag, expectedAliases);
  }
}

export function expectAliasMap(func: Function, tag: FluxTag<any>, expectedAliases: { [key: string]: any }) {
  const foundAliases = [];
  const aliasKeys = Object.keys(expectedAliases);

  tag.expose = (aliases, obj) => {
    if (!Array.isArray(aliases)) {
      aliases = [aliases];
    }
    foundAliases.push(...aliases);
    aliases.forEach((alias) => {
      if (aliasKeys.includes(alias)) {
        expect(obj).to.eq(expectedAliases[alias]);
      } else {
        expect.fail();
      }
    });
  };

  func();

  expect(foundAliases).to.have.length(aliasKeys.length);
}

export function expectAliasArray(func: Function, tag: FluxTag<any>, expectedAliases: string[]) {
  const foundAliases = [];

  tag.expose = (aliases, obj) => {
    expect(obj).to.be.undefined;
    if (!Array.isArray(aliases)) {
      aliases = [aliases];
    }
    foundAliases.push(...aliases);
    aliases.forEach((alias) => expect(expectedAliases).to.include(alias));
  };

  func();

  expect(foundAliases).to.have.length(expectedAliases.length);
}
