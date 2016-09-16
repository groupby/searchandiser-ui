declare namespace ParseUri {
  interface Parse {
    (url: string): UriStructure;
    options: Options;
  }

  interface Options {
    strictMode: boolean;
    key: string[];
    q: {
      name: string;
      parser: RegExp;
    };
    parser: {
      strict: RegExp;
      loose: RegExp;
    };
  }

  interface UriStructure {
    source: string;
    protocol: string;
    authority: string;
    userInfo: string;
    user: string;
    password: string;
    host: string;
    port: number;
    relative: string;
    path: string;
    directory: string;
    file: string;
    query: string;
    anchor: string;
  }
}

declare module 'parseuri' {

  var parseUri: ParseUri.Parse;

  export = parseUri;
}
