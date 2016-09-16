declare interface ObjectGet {
  (obj: any, path: string): any;
}

declare module 'oget' {

  var oget: ObjectGet;

  export = oget;
}
