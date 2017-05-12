import './bootstrap';

const coreContext = require.context('../src', true, /\.ts/);
coreContext.keys().forEach(coreContext);

const functionalTestContext = require.context('./functional', true, /\.ts/);
functionalTestContext.keys().forEach(functionalTestContext);

const unitTestContext = require.context('./unit', true, /\.ts/);
unitTestContext.keys().forEach(unitTestContext);
