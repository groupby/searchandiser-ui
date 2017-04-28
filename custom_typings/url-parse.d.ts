declare module 'url-parse' {
  class URL {
    protocol: string;
    slashes: boolean;
    auth: string;
    username: string;
    password: string;
    host: string;
    hostname: string;
    port: number;
    pathname: string;
    query: string | any;
    hash: string;
    href: string;
    origin: string;

    constructor(url: string, parser?: boolean | ((queryString: string) => any));
    constructor(url: string, baseUrl: string | any, parser?: boolean | ((queryString: string) => any));

    set(key: string, value: string | number): void;
    toString(): string;

  }

  interface QueryString {
    parse(queryString: string): any;
    stringify(params: any): string;
  }

  interface Parser {
    new (url: string, parser?: boolean | ((queryString: string) => any)): URL;
    // tslint:disable-next-line no-shadowed-variable
    new (url: string, baseUrl: string | any, parser?: boolean | ((queryString: string) => any)): URL;
    (url: string, parser?: boolean | ((queryString: string) => any)): URL;
    (url: string, baseUrl: string | any, parser?: boolean | ((queryString: string) => any)): URL;

    qs: QueryString;
  }

  const urlParse: Parser;

  export = urlParse;
}
