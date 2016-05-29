import { Refinement, ValueRefinement, RangeRefinement } from './response-models';
export declare class Request {
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
    userId: string;
    language: string;
    collection: string;
    area: string;
    biasingProfile: string;
    skip: number;
    pageSize: number;
    returnBinary: boolean;
    pruneRefinements: boolean;
    disableAutocorrection: boolean;
    wildcardSearchEnabled: boolean;
}
export declare type SortOrder = 'Ascending' | 'Descending';
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
export declare type BiasStrength = 'Absolute_Increase' | 'Strong_Increase' | 'Medium_Increase' | 'Weak_Increase' | 'Leave_Unchanged' | 'Weak_Decrease' | 'Medium_Decrease' | 'Strong_Decrease' | 'Absolute_Decrease';
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
