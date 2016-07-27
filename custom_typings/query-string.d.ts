declare interface QueryString {
  parse: (queryString: string) => any;
  stringify: (object: any, config?: any) => any;
}

declare var queryString: QueryString;

declare module 'query-string' {
  export = queryString;
}
