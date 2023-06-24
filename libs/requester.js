/* eslint-disable class-methods-use-this */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line no-underscore-dangle
const _ = require('lodash');
const axios = require('axios');

module.exports = class Requester {
  constructor(url, headers) {
    this.instance = axios.create({
      baseURL: url,
      timeout: 10000,
      headers,
    });
    this.activeURL = '';
  }

  on(url) {
    this.activeURL = url; // 'search'
    return this;
  }

  injectQueryParam(paramName, paramValue) {
    if (!paramValue) return;
    const op = this._isFirstParam(this.activeURL) ? '?' : '&';
    this.activeURL += `${op}${paramName}=${paramValue}`;
    return this;
  }

  _createRequest(requestType, payload, headers = {}) {
    // if (!this.activeURL) throw new Error('No active URL set');
    return this.instance.request({
      method: requestType,
      url: this.activeURL,
      data: payload,
      headers,
    });
  }

  get(payload, headers = {}) {
    return this._createRequest('GET', payload, headers);
  }

  post(payload, headers = {}) {
    return this._createRequest('POST', payload, headers);
  }

  put(payload, headers = {}) {
    return this._createRequest('PUT', payload, headers);
  }

  delete(payload, headers = {}) {
    return this._createRequest('DELETE', payload, headers);
  }

  patch(payload, headers = {}) {
    return this._createRequest('PATCH', payload, headers);
  }

  _isFirstParam(url) {
    return (_.isNil(url) || (url.indexOf('?') === -1));
  }
};
