import './test/bootstrap';

const coreContext = (<{ context?: Function }>require).context('./src', true, /\.ts/);
coreContext.keys().forEach(coreContext);

const testContext = (<{ context?: Function }>require).context('./test', true, /\.ts/);
testContext.keys().forEach(testContext);
