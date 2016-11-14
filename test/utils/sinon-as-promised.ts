function resolves(value: any) {
  return this.returns(new Promise((resolve) => resolve(value)));
}

sinon.stub.resolves = resolves;
// sinon.behavior.resolves = resolves

function rejects(err: any) {
  if (typeof err === 'string') {
    err = new Error(err);
  }
  return this.returns(new Promise((resolve, reject) => reject(err)));
}

sinon.stub.rejects = rejects;
// sinon.behavior.rejects = rejects
