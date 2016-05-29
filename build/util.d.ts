import { SelectedRefinement } from './request-models';
import { Navigation } from './response-models';
export declare class NavigationConverter {
    static convert(navigations: Array<Navigation>): Array<SelectedRefinement>;
}
