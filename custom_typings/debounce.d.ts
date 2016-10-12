declare interface Debounce {
  <A extends Function>(f: A, interval?: number, immediate?: boolean): A;
}

declare module 'debounce' {

  const debounce: Debounce;

  export = debounce;
}
