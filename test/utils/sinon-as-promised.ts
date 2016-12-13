export function resolves(value: any) {
  return this.returns(Promise.resolve(value));
}

sinon.stub.resolves = resolves;

export function rejects(err: any) {
  if (typeof err === 'string') {
    err = new Error(err);
  }
  return this.returns(Promise.reject(err));
}

sinon.stub.rejects = rejects;
