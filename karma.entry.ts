import './test/bootstrap';

const coreContext = (<{ context?: Function }>require).context('./src', true, /\.ts/);
coreContext.keys().forEach(coreContext);

const unitTestContext = (<{ context?: Function }>require).context('./test/unit', true, /\.ts/);
unitTestContext.keys().forEach(unitTestContext);

const functionalTestContext = (<{ context?: Function }>require).context('./test/functional', true, /\.ts/);
unitTestContext.keys().forEach(unitTestContext);
