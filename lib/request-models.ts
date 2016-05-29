import { Refinement, RefinementType, ValueRefinement, RangeRefinement } from './response-models';

export class Request {

  // query parameters
  query: string;
  fields: string[];
  orFields: string[];
  includedNavigations: string[];
  excludedNavigations: string[];
  sort: Sort[];
  customUrlParams: CustomUrlParam[];
  refinements: SelectedRefinement[];
  restrictNavigation: RestrictNavigation;
  biasing: Biasing;
  matchStrategy: MatchStrategy;

  // configuration
  userId: string;
  language: string;
  collection: string;
  area: string;
  biasingProfile: string;

  // paging
  skip: number;
  pageSize: number;

  // format
  returnBinary: boolean;
  pruneRefinements: boolean;
  disableAutocorrection: boolean;
  wildcardSearchEnabled: boolean;

}

export type SortOrder = 'Ascending' | 'Descending';

export interface Sort {
  field: string;
  order: SortOrder;
}

export interface CustomUrlParam {
  key: string;
  value: string;
}

export interface SelectedRefinement extends Refinement {
  navigationName: string;
}

export interface SelectedRangeRefinement extends SelectedRefinement, RangeRefinement {
}

export interface SelectedValueRefinement extends SelectedRefinement, ValueRefinement {
}

export interface RestrictNavigation {
  name: string;
  count: number;
}

export type BiasStrength = 'Absolute_Increase' | 'Strong_Increase' |
  'Medium_Increase' | 'Weak_Increase' | 'Leave_Unchanged' | 'Weak_Decrease' |
  'Medium_Decrease' | 'Strong_Decrease' | 'Absolute_Decrease';


export interface Bias {
  name: string;
  content?: string;
  strength: BiasStrength;
}

export interface Biasing {
  bringToTop?: string[];
  augmentBiases: boolean;
  biases: Bias[];
  influence?: number;
}

export interface PartialMatchRule {
  terms?: number;
  termsGreaterThan?: number;
  mustMatch?: number;
  percentage?: boolean;
}

export interface MatchStrategy {
  rules: PartialMatchRule[];
}
