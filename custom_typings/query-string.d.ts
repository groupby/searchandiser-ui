declare interface QueryString {
  parse: (queryString: string) => any;
  stringify: (object: any, config?: any) => any;
}

declare module 'query-string' {

  var queryString: QueryString;

  export = queryString;
}
