import { Query } from 'groupby-api';

export interface Beautifier {
  config: BeautifierConfig;
  parse(url: string): Query;
  build(query: Query): string;
}

export interface Generator {
  build(query: Query): string;
}

export interface Parser {
  parse(url: string): Query;
}

export interface BeautifierConfig {
  refinementMapping?: any[];
  extraRefinementsParam?: string;
  pageSizeParam?: string;
  pageParam?: string;
  defaultPageSize?: number;
  queryToken?: string;
  suffix?: string;
  useReferenceKeys?: boolean;
}
