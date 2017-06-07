import { SearchandiserConfig } from '../../searchandiser';
import { SelectedValueRefinement } from 'groupby-api';

export interface Beautifier {
  config: BeautifierConfig;
  searchandiserConfig: SearchandiserConfig;
  parse(rawUrl: string): any;
  build(query: any): string;
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
  navigations?: Object;
  prefix: {
    query: string,
    detail: string,
    navigation: string
  };
}

export interface Detail {
  productTitle: string;
  productID: string;
  refinements?: SelectedValueRefinement[];
}
