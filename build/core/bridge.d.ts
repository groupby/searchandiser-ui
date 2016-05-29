import { Request } from '../request-models';
import { Results, Record } from '../response-models';
import { Query } from './query';
export interface RawRecord extends Record {
    _id: string;
    _u: string;
    _t: string;
    _snippet?: string;
}
export declare abstract class AbstractBridge {
    protected bridgeUrl: string;
    protected abstract augmentRequest(request: any): any;
    search(query: string | Query | Request, callback?: (Error?, Results?) => void): PromiseLike<Results> | void;
    private extractRequest(query);
    private generateError(error, callback);
    private fireRequest(url, body, queryParams);
    private convertRecordFields(record);
}
export declare class CloudBridge extends AbstractBridge {
    private clientKey;
    private bridgeRefinementsUrl;
    private bridgeRefinementsSearchUrl;
    private bridgeClusterUrl;
    constructor(clientKey: string, customerId: string);
    protected augmentRequest(request: any): any;
}
export declare class BrowserBridge extends AbstractBridge {
    constructor(customerId: string);
    protected augmentRequest(request: any): any;
}
