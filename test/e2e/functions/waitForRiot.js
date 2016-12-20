/* eslint-disable prefer-arrow-callback,no-magic-numbers */
const util = require('util');
const events = require('events');

const FIREFOX_TIMEOUT = 1000;
const DEFAULT_TIMEOUT = 500;
const CHECK_TIMEOUT = 25;

function WaitForRiot() {
  events.EventEmitter.call(this);
  this.startTime = null;
}

util.inherits(WaitForRiot, events.EventEmitter);

WaitForRiot.prototype.command = function(timeout) {

  if (this.api.capabilities.browserName === 'firefox') {
    setTimeout(() => {
      this.client.assertion(true, '', 'riot loaded', `waitForRiot() defaulted to ${FIREFOX_TIMEOUT}ms because firefox`, true);
      this.emit('complete');
    }, FIREFOX_TIMEOUT);
  } else {
    let message = null;
    this.startTime = new Date().getTime();
    timeout = timeout || DEFAULT_TIMEOUT;

    this.setup((setupComplete, configuredTime) => {
      if (setupComplete) {
        message = `searchandiser was configured after ${configuredTime - this.startTime} ms.`;
      } else {
        message = `searchandiser was still not configured after ${timeout} ms.`;
      }
      this.client.assertion(setupComplete, 'searchandiser not configured', 'searchandiser configured', message, true);

      this.check((result, loadedTime) => {
        if (result) {
          message = `riot loaded after ${loadedTime - this.startTime} ms.`;
        } else {
          message = `riot was still not loaded after ${timeout} ms.`;
        }
        this.client.assertion(result, 'riot not loaded', 'riot loaded', message, true);
        this.emit('complete');
      }, timeout, CHECK_TIMEOUT);
    }, timeout, CHECK_TIMEOUT);
  }

  return this;
};

WaitForRiot.prototype.setup = function(callback, maxTime, testTime) {
  waitFor(new Promise((resolve) => this.api.execute(function() {
    return window.searchandiser.flux !== undefined;
  }, [], (result) => resolve(result.value))), (complete, time) => {
    if (complete) {
      this.api.execute(function() {
        return window.searchandiser.flux.on('results', function() {
          window.searchandiser.__loaded__ = true;
        });
      }, [], () => callback(true, time));
    } else {
      callback(false);
    }
  }, maxTime, testTime);
};

WaitForRiot.prototype.check = function(callback, maxTime, testTime) {
  waitFor(new Promise((resolve) => this.api.execute(function() {
    return window.searchandiser.__loaded__;
  }, [], (result) => resolve(result.value))), callback, maxTime, testTime);
};

function waitFor(promise, callback, maxTime, testTime) {
  promise
    .then((complete) => {
      const now = new Date().getTime();
      if (complete) {
        callback(true, now);
      } else if (now - this.startTime < maxTime) {
        setTimeout(() => this.check(callback, maxTime), testTime);
      } else {
        callback(false);
      }
    })
    .catch(() => setTimeout(() => this.check(callback, maxTime), testTime));
}

module.exports = WaitForRiot;
