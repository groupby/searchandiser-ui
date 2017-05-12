declare module 'dot-prop' {
  interface DotProp {
    get<T>(obj: any, path: string, defaultValue?: T): T;
    set(obj: any, path: string, value: any): void;
    has(obj: any, path: string): boolean;
    delete(obj: any, path: string): void;
  }

  const dotProp: DotProp;

  export = dotProp;
}
