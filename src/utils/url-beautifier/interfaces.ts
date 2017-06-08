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
  params?: {
    page?: string;
    pageSize?: string;
    refinements?: string;
    sort?: string;
  };
  queryToken?: string;
  suffix?: string;
  useReferenceKeys?: boolean;
  navigations?: any;
  routes: {
    query: string,
    detail: string,
    navigation: string
  };
}

export interface Detail {
  productTitle: string;
  productId: string;
  refinements: SelectedValueRefinement[];
}
