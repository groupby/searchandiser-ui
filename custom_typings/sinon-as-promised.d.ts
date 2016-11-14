declare namespace Sinon {

  export interface SinonStubStatic {
    resolves?: (value: any) => Promise<any>;
    rejects?: (err: any) => Promise<Error>;
  }

  export interface SinonStub {
    resolves(value?: any): SinonStub;
    rejects(err?: any): SinonStub;
  }
}
