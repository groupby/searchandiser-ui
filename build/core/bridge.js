"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var axios = require('axios');
var assign = require('object-assign');
var query_1 = require('./query');
var SEARCH = '/search';
var REFINEMENTS = '/refinements';
var REFINEMENT_SEARCH = '/refinement';
var CLUSTER = '/cluster';
var BIASING_DEFAULTS = {
    biases: [],
    bringToTop: [],
    augmentBiases: false
};
var AbstractBridge = (function () {
    function AbstractBridge() {
    }
    AbstractBridge.prototype.search = function (query, callback) {
        if (callback === void 0) { callback = undefined; }
        var _a = this.extractRequest(query), request = _a[0], queryParams = _a[1];
        if (request === null)
            return this.generateError('query was not of a recognised type', callback);
        var response = this.fireRequest(this.bridgeUrl, request, queryParams);
        if (callback) {
            response.then(function (res) { return callback(undefined, res); })
                .catch(function (err) { return callback(err); });
        }
        else {
            return response;
        }
    };
    AbstractBridge.prototype.extractRequest = function (query) {
        switch (typeof query) {
            case 'string': return [new query_1.Query(query).build(), {}];
            case 'object':
                if (query instanceof query_1.Query)
                    return [query.build(), query.queryParams];
                else
                    return [query, {}];
            default: return [null, null];
        }
    };
    AbstractBridge.prototype.generateError = function (error, callback) {
        var err = new Error(error);
        if (callback)
            callback(err);
        else
            return Promise.reject(err);
    };
    AbstractBridge.prototype.fireRequest = function (url, body, queryParams) {
        var _this = this;
        var options = {
            url: this.bridgeUrl,
            method: 'post',
            params: queryParams,
            data: this.augmentRequest(body),
            responseType: 'json',
            timeout: 1500
        };
        return axios(options)
            .then(function (res) { return res.data; })
            .then(function (res) { return res.records ? assign(res, { records: res.records.map(_this.convertRecordFields) }) : res; });
    };
    AbstractBridge.prototype.convertRecordFields = function (record) {
        var converted = assign(record, { id: record._id, url: record._u, title: record._t });
        delete converted._id, converted._u, converted._t;
        if (record._snippet) {
            converted.snippet = record._snippet;
            delete converted._snippet;
        }
        return converted;
    };
    return AbstractBridge;
}());
exports.AbstractBridge = AbstractBridge;
var CloudBridge = (function (_super) {
    __extends(CloudBridge, _super);
    function CloudBridge(clientKey, customerId) {
        _super.call(this);
        this.clientKey = clientKey;
        this.bridgeRefinementsUrl = null;
        this.bridgeRefinementsSearchUrl = null;
        this.bridgeClusterUrl = null;
        var baseUrl = "https://" + customerId + ".groupbycloud.com:443/api/v1";
        this.bridgeUrl = baseUrl + SEARCH;
        this.bridgeRefinementsUrl = baseUrl + REFINEMENTS;
        this.bridgeRefinementsSearchUrl = baseUrl + REFINEMENT_SEARCH;
        this.bridgeClusterUrl = baseUrl + CLUSTER;
    }
    CloudBridge.prototype.augmentRequest = function (request) {
        return assign(request, { clientKey: this.clientKey });
    };
    return CloudBridge;
}(AbstractBridge));
exports.CloudBridge = CloudBridge;
var BrowserBridge = (function (_super) {
    __extends(BrowserBridge, _super);
    function BrowserBridge(customerId) {
        _super.call(this);
        this.bridgeUrl = "http://ecomm.groupbycloud.com/semanticSearch/" + customerId;
    }
    BrowserBridge.prototype.augmentRequest = function (request) {
        return request;
    };
    return BrowserBridge;
}(AbstractBridge));
exports.BrowserBridge = BrowserBridge;

//# sourceMappingURL=data:application/json;base64,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QyxxQkFBb0IsU0FBaUIsRUFBRSxVQUFrQjtRQUN2RCxpQkFBTyxDQUFDO1FBRFUsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUo3Qix5QkFBb0IsR0FBVyxJQUFJLENBQUM7UUFDcEMsK0JBQTBCLEdBQVcsSUFBSSxDQUFDO1FBQzFDLHFCQUFnQixHQUFXLElBQUksQ0FBQztRQUl0QyxJQUFNLE9BQU8sR0FBRyxhQUFXLFVBQVUsaUNBQThCLENBQUM7UUFDcEUsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxPQUFPLEdBQUcsV0FBVyxDQUFDO1FBQ2xELElBQUksQ0FBQywwQkFBMEIsR0FBRyxPQUFPLEdBQUcsaUJBQWlCLENBQUM7UUFDOUQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDNUMsQ0FBQztJQUVTLG9DQUFjLEdBQXhCLFVBQXlCLE9BQVk7UUFDbkMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FsQkEsQUFrQkMsQ0FsQmdDLGNBQWMsR0FrQjlDO0FBbEJZLG1CQUFXLGNBa0J2QixDQUFBO0FBRUQ7SUFBbUMsaUNBQWM7SUFDL0MsdUJBQVksVUFBa0I7UUFDNUIsaUJBQU8sQ0FBQztRQUNSLElBQUksQ0FBQyxTQUFTLEdBQUcsa0RBQWdELFVBQVksQ0FBQztJQUNoRixDQUFDO0lBRVMsc0NBQWMsR0FBeEIsVUFBeUIsT0FBWTtRQUNuQyxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFDSCxvQkFBQztBQUFELENBVEEsQUFTQyxDQVRrQyxjQUFjLEdBU2hEO0FBVFkscUJBQWEsZ0JBU3pCLENBQUEiLCJmaWxlIjoiY29yZS9icmlkZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MgPSByZXF1aXJlKCdheGlvcycpO1xuaW1wb3J0IGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcbmltcG9ydCB7IFJlcXVlc3QgfSBmcm9tICcuLi9yZXF1ZXN0LW1vZGVscyc7XG5pbXBvcnQgeyBSZXN1bHRzLCBSZWNvcmQgfSBmcm9tICcuLi9yZXNwb25zZS1tb2RlbHMnO1xuaW1wb3J0IHsgUXVlcnkgfSBmcm9tICcuL3F1ZXJ5JztcblxuY29uc3QgU0VBUkNIID0gJy9zZWFyY2gnO1xuY29uc3QgUkVGSU5FTUVOVFMgPSAnL3JlZmluZW1lbnRzJztcbmNvbnN0IFJFRklORU1FTlRfU0VBUkNIID0gJy9yZWZpbmVtZW50JztcbmNvbnN0IENMVVNURVIgPSAnL2NsdXN0ZXInO1xuY29uc3QgQklBU0lOR19ERUZBVUxUUyA9IHtcbiAgYmlhc2VzOiBbXSxcbiAgYnJpbmdUb1RvcDogW10sXG4gIGF1Z21lbnRCaWFzZXM6IGZhbHNlXG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIFJhd1JlY29yZCBleHRlbmRzIFJlY29yZCB7XG4gIF9pZDogc3RyaW5nO1xuICBfdTogc3RyaW5nO1xuICBfdDogc3RyaW5nO1xuICBfc25pcHBldD86IHN0cmluZztcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFic3RyYWN0QnJpZGdlIHtcbiAgcHJvdGVjdGVkIGJyaWRnZVVybDogc3RyaW5nO1xuXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBhdWdtZW50UmVxdWVzdChyZXF1ZXN0OiBhbnkpOiBhbnk7XG5cbiAgc2VhcmNoKHF1ZXJ5OiBzdHJpbmcgfCBRdWVyeSB8IFJlcXVlc3QsIGNhbGxiYWNrOiAoRXJyb3I/LCBSZXN1bHRzPykgPT4gdm9pZCA9IHVuZGVmaW5lZCk6IFByb21pc2VMaWtlPFJlc3VsdHM+IHwgdm9pZCB7XG4gICAgbGV0IFtyZXF1ZXN0LCBxdWVyeVBhcmFtc10gPSB0aGlzLmV4dHJhY3RSZXF1ZXN0KHF1ZXJ5KTtcbiAgICBpZiAocmVxdWVzdCA9PT0gbnVsbCkgcmV0dXJuIHRoaXMuZ2VuZXJhdGVFcnJvcigncXVlcnkgd2FzIG5vdCBvZiBhIHJlY29nbmlzZWQgdHlwZScsIGNhbGxiYWNrKTtcblxuICAgIGNvbnN0IHJlc3BvbnNlID0gdGhpcy5maXJlUmVxdWVzdCh0aGlzLmJyaWRnZVVybCwgcmVxdWVzdCwgcXVlcnlQYXJhbXMpO1xuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgcmVzcG9uc2UudGhlbihyZXMgPT4gY2FsbGJhY2sodW5kZWZpbmVkLCByZXMpKVxuICAgICAgICAuY2F0Y2goZXJyID0+IGNhbGxiYWNrKGVycikpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBleHRyYWN0UmVxdWVzdChxdWVyeTogYW55KTogW1JlcXVlc3QsIGFueV0ge1xuICAgIHN3aXRjaCAodHlwZW9mIHF1ZXJ5KSB7XG4gICAgICBjYXNlICdzdHJpbmcnOiByZXR1cm4gW25ldyBRdWVyeSg8c3RyaW5nPnF1ZXJ5KS5idWlsZCgpLCB7fV07XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBpZiAocXVlcnkgaW5zdGFuY2VvZiBRdWVyeSkgcmV0dXJuIFtxdWVyeS5idWlsZCgpLCBxdWVyeS5xdWVyeVBhcmFtc107XG4gICAgICAgIGVsc2UgcmV0dXJuIFtxdWVyeSwge31dO1xuICAgICAgZGVmYXVsdDogcmV0dXJuIFtudWxsLCBudWxsXTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdlbmVyYXRlRXJyb3IoZXJyb3I6IHN0cmluZywgY2FsbGJhY2s6IChFcnJvcikgPT4gdm9pZCk6IHZvaWQgfCBQcm9taXNlTGlrZTxhbnk+IHtcbiAgICBjb25zdCBlcnIgPSBuZXcgRXJyb3IoZXJyb3IpO1xuICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soZXJyKTtcbiAgICBlbHNlIHJldHVybiBQcm9taXNlLnJlamVjdChlcnIpO1xuICB9XG5cbiAgcHJpdmF0ZSBmaXJlUmVxdWVzdCh1cmw6IHN0cmluZywgYm9keTogUmVxdWVzdCB8IGFueSwgcXVlcnlQYXJhbXM6IGFueSk6IEF4aW9zLklQcm9taXNlPFJlc3VsdHM+IHtcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgdXJsOiB0aGlzLmJyaWRnZVVybCxcbiAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgcGFyYW1zOiBxdWVyeVBhcmFtcyxcbiAgICAgIGRhdGE6IHRoaXMuYXVnbWVudFJlcXVlc3QoYm9keSksXG4gICAgICByZXNwb25zZVR5cGU6ICdqc29uJyxcbiAgICAgIHRpbWVvdXQ6IDE1MDBcbiAgICB9O1xuICAgIHJldHVybiBheGlvcyhvcHRpb25zKVxuICAgICAgLnRoZW4ocmVzID0+IHJlcy5kYXRhKVxuICAgICAgLnRoZW4ocmVzID0+IHJlcy5yZWNvcmRzID8gYXNzaWduKHJlcywgeyByZWNvcmRzOiByZXMucmVjb3Jkcy5tYXAodGhpcy5jb252ZXJ0UmVjb3JkRmllbGRzKSB9KSA6IHJlcyk7XG4gIH1cblxuICBwcml2YXRlIGNvbnZlcnRSZWNvcmRGaWVsZHMocmVjb3JkOiBSYXdSZWNvcmQpOiBSZWNvcmQgfCBSYXdSZWNvcmQge1xuICAgIGNvbnN0IGNvbnZlcnRlZCA9IGFzc2lnbihyZWNvcmQsIHsgaWQ6IHJlY29yZC5faWQsIHVybDogcmVjb3JkLl91LCB0aXRsZTogcmVjb3JkLl90IH0pO1xuICAgIGRlbGV0ZSBjb252ZXJ0ZWQuX2lkLCBjb252ZXJ0ZWQuX3UsIGNvbnZlcnRlZC5fdDtcblxuICAgIGlmIChyZWNvcmQuX3NuaXBwZXQpIHtcbiAgICAgIGNvbnZlcnRlZC5zbmlwcGV0ID0gcmVjb3JkLl9zbmlwcGV0O1xuICAgICAgZGVsZXRlIGNvbnZlcnRlZC5fc25pcHBldDtcbiAgICB9XG5cbiAgICByZXR1cm4gY29udmVydGVkO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDbG91ZEJyaWRnZSBleHRlbmRzIEFic3RyYWN0QnJpZGdlIHtcblxuICBwcml2YXRlIGJyaWRnZVJlZmluZW1lbnRzVXJsOiBzdHJpbmcgPSBudWxsO1xuICBwcml2YXRlIGJyaWRnZVJlZmluZW1lbnRzU2VhcmNoVXJsOiBzdHJpbmcgPSBudWxsO1xuICBwcml2YXRlIGJyaWRnZUNsdXN0ZXJVcmw6IHN0cmluZyA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjbGllbnRLZXk6IHN0cmluZywgY3VzdG9tZXJJZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoKTtcbiAgICBjb25zdCBiYXNlVXJsID0gYGh0dHBzOi8vJHtjdXN0b21lcklkfS5ncm91cGJ5Y2xvdWQuY29tOjQ0My9hcGkvdjFgO1xuICAgIHRoaXMuYnJpZGdlVXJsID0gYmFzZVVybCArIFNFQVJDSDtcbiAgICB0aGlzLmJyaWRnZVJlZmluZW1lbnRzVXJsID0gYmFzZVVybCArIFJFRklORU1FTlRTO1xuICAgIHRoaXMuYnJpZGdlUmVmaW5lbWVudHNTZWFyY2hVcmwgPSBiYXNlVXJsICsgUkVGSU5FTUVOVF9TRUFSQ0g7XG4gICAgdGhpcy5icmlkZ2VDbHVzdGVyVXJsID0gYmFzZVVybCArIENMVVNURVI7XG4gIH1cblxuICBwcm90ZWN0ZWQgYXVnbWVudFJlcXVlc3QocmVxdWVzdDogYW55KTogYW55IHtcbiAgICByZXR1cm4gYXNzaWduKHJlcXVlc3QsIHsgY2xpZW50S2V5OiB0aGlzLmNsaWVudEtleSB9KTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQnJvd3NlckJyaWRnZSBleHRlbmRzIEFic3RyYWN0QnJpZGdlIHtcbiAgY29uc3RydWN0b3IoY3VzdG9tZXJJZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmJyaWRnZVVybCA9IGBodHRwOi8vZWNvbW0uZ3JvdXBieWNsb3VkLmNvbS9zZW1hbnRpY1NlYXJjaC8ke2N1c3RvbWVySWR9YDtcbiAgfVxuXG4gIHByb3RlY3RlZCBhdWdtZW50UmVxdWVzdChyZXF1ZXN0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiByZXF1ZXN0O1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
