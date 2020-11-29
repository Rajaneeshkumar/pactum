const phin = require('phin');
const fuzzCore = require('openapi-fuzzer-core');
const log = require('../helpers/logger');
const rp = require('../helpers/requestProcessor');
const helper = require('../helpers/helper');

const BASE_URL_PATTERN = /^https?:\/\/[^\/]+/i;

class Tosser {

  constructor(fuzz) {
    this.fuzz = fuzz;
    this.baseUrl = '';
    this.specs = [];
    this.responses = [];
  }

  async toss() {
    const data = await this.getSwaggerJson();
    this.specs = fuzzCore.swagger(data);
    this.setBaseUrl();
    await this.sendRequestsAndValidateResponses();
  }

  async getSwaggerJson() {
    const request = rp.process({ method: 'get', url: this.fuzz.swaggerUrl });
    request.parse = 'json';
    const response = await phin(request);
    return response.body;
  }

  setBaseUrl() {
    const matches = this.fuzz.swaggerUrl.match(BASE_URL_PATTERN);
    if (matches) {
      this.baseUrl = matches[0];
    }
  }

  async sendRequestsAndValidateResponses() {
    this.printStartMessage();
    let specs = [];
    let promises = [];
    let responses = [];
    for (let i = 0; i < this.specs.length; i++) {
      const spec = this.specs[i];
      const request = spec.request;
      request.url = this.baseUrl ? this.baseUrl + request.path : request.path;
      log.info(`${spec.name} - ${request.method} ${request.path}`);
      spec.request = rp.process(request);
      specs.push(spec);
      promises.push(phin(spec.request));
      if ((i + 1) % this.fuzz.batchSize === 0) {
        responses = responses.concat(await Promise.all(promises));
        this.validate(specs, responses);
        promises = [];
        responses = [];
        specs = [];
      }
    }
    responses = responses.concat(await Promise.all(promises));
    this.validate(specs, responses);
  }

  validate(specs, responses) {
    for (let i = 0; i < responses.length; i++) {
      const response = helper.getTrimResponse(responses[i]);
      const status = response.statusCode;
      if (this.fuzz._inspect) {
        this.printReqAndRes(specs[i].request, response);
      }
      if (status < 400 || status > 499) {
        this.printReqAndRes(specs[i].request, response);
        throw new Error(`Fuzz Failure | Status Code: ${status}`);
      }
    }
  }

  printStartMessage() {
    log.info(`===================`);
    log.info(`Starting Fuzz  `);
    log.info(`===================`);
    log.info(`Requests   :  ${this.specs.length}`);
    log.info(`Batch Size :  ${this.fuzz.batchSize}`);
    log.info(`===================\n`);
  }

  printReqAndRes(request, response) {
    log.warn('Request', request);
    log.warn('Response', response);
  }

}

module.exports = Tosser;