/*eslint no-console: "off" */
const checker = require('gb-license-check');

const PACKAGE_WHITELIST = {
  'base64id': ['^0.1.0'], // MIT in package.json
  'better-assert': ['^1.0.2'], // MIT at https://github.com/tj/better-assert/blob/master/LICENSE
  'callsite': ['^1.0.0'], //  MIT at https://github.com/tj/callsite/blob/master/LICENSE
  'commander': [
    '^0.6.1',
    '^2.3.0'
  ], // MIT license https://github.com/tj/commander.js/blob/master/LICENSE
  'component-bind': ['^1.0.0'], // MIT at https://github.com/component/bind/blob/master/LICENSE
  'component-emitter': ['^1.1.2'], // MIT at https://github.com/component/emitter/blob/master/LICENSE
  'component-inherit': ['^0.0.3'], // MIT at https://github.com/component/inherit/blob/master/LICENSE
  'debug': ['^0.7.4'], // MIT at https://github.com/visionmedia/debug/blob/master/LICENSE
  'indexof': ['^0.0.1'], // MIT at https://github.com/component/indexof/blob/master/LICENSE
  'ripemd160': ['^0.2.0'], // MIT at https://github.com/crypto-browserify/ripemd160/blob/master/LICENSE.md
  'jsonp': ['^0.2.0'], // Says MIT at the bottom of https://github.com/webmodules/jsonp/blob/master/Readme.md
  'log-driver': ['^1.2.5'], // Has ISC license https://github.com/cainus/logdriver/blob/master/LICENSE
  'tweetnacl':  ['^0.14.3'] // Has unlimited license https://github.com/dchest/tweetnacl-js/blob/master/COPYING.txt
};

checker.run(PACKAGE_WHITELIST, (err) => {
  if (err) {
    console.error('ERROR: Unknown licenses found');
    process.exit(1);
  }

  console.log('License check successful');
});
