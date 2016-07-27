declare module 'oget' {
  interface ObjectGet {
    (obj: any, path: string): any;
  }
  var oget: ObjectGet;

  export = oget;
}
