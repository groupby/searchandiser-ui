/* eslint-disable prefer-arrow-callback,no-magic-numbers */
const util = require('util');
const events = require('events');

const DEFAULT_TIMEOUT = 500;

function WaitForRiot() {
  events.EventEmitter.call(this);
}

util.inherits(WaitForRiot, events.EventEmitter);

WaitForRiot.prototype.command = function(msOrCb, cb) {
  const hasMs = typeof msOrCb !== 'number';
  const ms = hasMs && msOrCb || DEFAULT_TIMEOUT;
  cb = hasMs ? msOrCb : cb;

  // const scheduledSetup = setInterval(() => {
  //   this.client.api.execute(function() {
  //     return window.searchandiser.flux !== undefined;
  //   }, [], (res) => {
  //     if (res.value) {
  //       clearInterval(scheduledSetup);
  //       this.client.api.execute(function() {
  //         window.searchandiser.flux.once('results', function() {
  //           window.searchandiser.__loaded__ = true;
  //         });
  //       }, [], () => this.checkLoad(ms, cb));
  //     }
  //   });
  // }, 10);
  setTimeout(() => {
    this.emit('complete');
  }, DEFAULT_TIMEOUT);

  return this;
};

WaitForRiot.prototype.checkLoad = function(ms, cb) {
  let elapsed = 0;
  const scheduledCheck = setInterval(() => {
    this.client.api.execute(function() {
      return window.searchandiser.__loaded__;
    }, [], (res) => {
      if (res.value) {
        clearInterval(scheduledCheck);

        if (cb) {
          cb.call(this.client.api);
        }
        this.emit('complete');
      }
    });

    if (elapsed >= ms) {
      clearInterval(scheduledCheck);
      this.client.assertion(false, 'loaded', 'not loaded', 'expected riot to be loaded');
    }

    elapsed++;
  }, 10);
};

module.exports = WaitForRiot;
