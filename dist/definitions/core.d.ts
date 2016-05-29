import { Query, BrowserBridge, Results } from 'groupby-api';
export declare class Searchandiser {
    private static CONFIG;
    static bridge: BrowserBridge;
    static query: Query;
    static results: Results;
    static state: ISearchState & any;
    static el: any;
    constructor(config?: ISearchandiserConfig & any);
    static attach(tagName: Component, cssSelector: string, handler?: (tag) => void): void;
    static search(query: string | Query): void;
}
export interface ISearchState {
    lastStep: number;
    refinements: any[];
}
export declare type Component = 'query' | 'didYouMean' | 'relatedSearches' | 'selectedNavigation' | 'availableNavigation' | 'paging' | 'results' | 'template';
export interface ISearchandiserConfig {
    customerId: string;
    area?: string;
    collection?: string;
    language?: string;
    structure?: {
        title?: string;
        imagePrefix?: string;
        image?: string;
        imageSuffix?: string;
        description?: string;
    };
}
