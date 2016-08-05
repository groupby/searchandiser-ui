declare namespace Riot {
  interface Instance {
    mixin<T>(obj: T): T;
    mixin<T>(label: string, obj: T): T;
    mixin<T>(label: string, obj: T, global: boolean): T;
  }
}
