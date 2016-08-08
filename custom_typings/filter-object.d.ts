declare function filterObject(obj: any, glob: string);
declare function filterObject(obj: any, globs: string[]);

declare module 'filter-object' {
  export = filterObject;
}
