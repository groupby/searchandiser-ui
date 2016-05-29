var dts = require('dts-bundle');
var packageJson = require('../package.json');

dts.bundle({
    name: packageJson.name,
    main: 'build/api-javascript.d.ts'
});
