import axios = require('axios');
import assign = require('object-assign');
import { Request } from '../request-models';
import { Results, Record } from '../response-models';
import { Query } from './query';

const SEARCH = '/search';
const REFINEMENTS = '/refinements';
const REFINEMENT_SEARCH = '/refinement';
const CLUSTER = '/cluster';
const BIASING_DEFAULTS = {
  biases: [],
  bringToTop: [],
  augmentBiases: false
};

export interface RawRecord extends Record {
  _id: string;
  _u: string;
  _t: string;
  _snippet?: string;
}

export abstract class AbstractBridge {
  protected bridgeUrl: string;

  protected abstract augmentRequest(request: any): any;

  search(query: string | Query | Request, callback: (Error?, Results?) => void = undefined): PromiseLike<Results> | void {
    let [request, queryParams] = this.extractRequest(query);
    if (request === null) return this.generateError('query was not of a recognised type', callback);

    const response = this.fireRequest(this.bridgeUrl, request, queryParams);
    if (callback) {
      response.then(res => callback(undefined, res))
        .catch(err => callback(err));
    } else {
      return response;
    }
  }

  private extractRequest(query: any): [Request, any] {
    switch (typeof query) {
      case 'string': return [new Query(<string>query).build(), {}];
      case 'object':
        if (query instanceof Query) return [query.build(), query.queryParams];
        else return [query, {}];
      default: return [null, null];
    }
  }

  private generateError(error: string, callback: (Error) => void): void | PromiseLike<any> {
    const err = new Error(error);
    if (callback) callback(err);
    else return Promise.reject(err);
  }

  private fireRequest(url: string, body: Request | any, queryParams: any): Axios.IPromise<Results> {
    const options = {
      url: this.bridgeUrl,
      method: 'post',
      params: queryParams,
      data: this.augmentRequest(body),
      responseType: 'json',
      timeout: 1500
    };
    return axios(options)
      .then(res => res.data)
      .then(res => res.records ? assign(res, { records: res.records.map(this.convertRecordFields) }) : res);
  }

  private convertRecordFields(record: RawRecord): Record | RawRecord {
    const converted = assign(record, { id: record._id, url: record._u, title: record._t });
    delete converted._id, converted._u, converted._t;

    if (record._snippet) {
      converted.snippet = record._snippet;
      delete converted._snippet;
    }

    return converted;
  }
}

export class CloudBridge extends AbstractBridge {

  private bridgeRefinementsUrl: string = null;
  private bridgeRefinementsSearchUrl: string = null;
  private bridgeClusterUrl: string = null;

  constructor(private clientKey: string, customerId: string) {
    super();
    const baseUrl = `https://${customerId}.groupbycloud.com:443/api/v1`;
    this.bridgeUrl = baseUrl + SEARCH;
    this.bridgeRefinementsUrl = baseUrl + REFINEMENTS;
    this.bridgeRefinementsSearchUrl = baseUrl + REFINEMENT_SEARCH;
    this.bridgeClusterUrl = baseUrl + CLUSTER;
  }

  protected augmentRequest(request: any): any {
    return assign(request, { clientKey: this.clientKey });
  }
}

export class BrowserBridge extends AbstractBridge {
  constructor(customerId: string) {
    super();
    this.bridgeUrl = `http://ecomm.groupbycloud.com/semanticSearch/${customerId}`;
  }

  protected augmentRequest(request: any): any {
    return request;
  }
}
