declare interface ObjectGet {
  (obj: any, path: string, defaultVal?: any): any;
}

declare module 'oget' {

  const oget: ObjectGet;

  export = oget;
}
