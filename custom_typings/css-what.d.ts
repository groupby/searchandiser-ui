declare module 'css-what' {
  namespace cssWhat {
    interface Options {
      xmlMode?: boolean;
    }
    interface Result {
      type: string;
      name: string;
      action?: string;
      value?: string;
      data?: string;
      ignoreCase?: boolean;
    }
  }
  function cssWhat(selector: String, options?: cssWhat.Options): cssWhat.Result[][];
  export = cssWhat;
}
