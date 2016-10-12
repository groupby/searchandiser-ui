Testing Patterns
===

#### Simple Test Layout

```js
it('should do something', () => {
  // SETUP
  // initialize all constants at the top
  // modify any objects that establish state for the test
  const value = 'value';
  const object = { a: 'b' };
  const tag = new Tag();
  tag.action = () => null;
  // constants can be inlined if not used in expectation
  tag.field = 'priceField';
  tag.flag = false;

  // ACTION
  tag.doAction();

  // EXPECTATIONS
  expect(tag.flag).to.be.true;
  expect(tag.selected()).to.eq(object);
});
```

#### Async Test Layout

Use for testing with promises, or tests that should exit early.

```js
it('should do something asynchronous', (done) => {
  // SETUP
  const tag = new Tag();
  tag.flag = false;
  tag.action = () => {
    // EXPECTATIONS
    expect(tag.flag).to.be.true;
    done(); // <<< DONE!
  };

  // ACTION
  tag.doAction();
});
```

Unit Tests
---

#### Subscription to event emitter

```js
import { expectSubscriptions } from '../utils/expectations';

it('should subscribe to events', () => {
  const tag = new Tag();
  // should set up subscriptions when this function is called
  const emitFunction = () => tag.init();

  expectSubscriptions(emitFunction, {
    // will validate that 'mount' is subscribed to with function 'tag.someFunction()'
    'mount': tag.someFunction,
    // will validate that 'mount' is subscribed to with a function
    // (asserts type === 'function')
    'updated': null
  }, tag); // final parameter is the event emitter to listen on
});  
```

Sinon
---

### Stubbing

##### Do not stub if no expectation

```js
it('should not use stub', () => {
  const tag = new Tag();
  tag.action = () => null;

  const result = tag.doAction();

  expect(result).to.be.ok;
});
```

##### Do not stub if no existing property

```js
it('should not use stub', () => {
  const reset = sinon.spy();
  const flux: any = { reset };
  const tag = new Tag(reset);

  tag.doAction();

  expect(reset.called).to.be.ok;
});
```

##### Stubs with expectations

```js
it('should check for stub called', () => {
  const tag = new Tag();
  const stub = sandbox.stub(tag, 'action', (value) => expect(value).to.eq('brand'));

  tag.doAction();

  expect(stub.called).to.be.true;
});
```

##### Validate all terminal stubs

```js
it('should check for stub called', () => {
  const tag = new Tag();
  const action = sandbox.stub(tag, 'action', (value) => expect(value).to.eq('brand'));
  const otherAction = sandbox.stub(tag, 'otherAction', (value) => expect(value).to.eq('brand'));
  const finalAction = sandbox.stub(tag, 'finalAction', (value) => expect(value).to.eq('brand'));

  tag.doAction();

  expect(action.called).to.be.true;
  expect(otherAction.called).to.be.true;
  expect(finalAction.called).to.be.true;
});
```

##### Skip validating non-terminal stubs

`otherAction` and `finalAction` don't need to be validated as they return
unique objects that are chained to other stubs that **are** validated.

```js
it('should check for stub called', () => {
  const tag = new Tag();
  const obj1 = { a: 'b'};
  const obj2 = { c: 'd'};
  const action = sandbox.stub(tag, 'action', (value) => expect(value).to.eq(obj2));
  sandbox.stub(tag, 'otherAction', () => obj1);
  sandbox.stub(tag, 'finalAction', (value) => {
    expect(value).to.eq(obj1);
    return obj2;
  });

  tag.doAction();

  expect(action.called).to.be.true;
});
```
