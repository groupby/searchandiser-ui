declare module 'debounce' {
  function debounce<A extends Function>(f: A, interval?: number, immediate?: boolean): A
  export = debounce;
}
