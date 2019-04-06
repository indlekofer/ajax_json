import sinon from 'sinon';
import ajaxJson, { ERROR_JSON, ERROR_REJECT } from '../src/index';

import { expect } from 'chai';

describe('index', () => {
  var requests;
  beforeEach(() => {
    requests = []
    global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
    requests = [];
    XMLHttpRequest.onCreate = (xhr) => {
      requests.push(xhr);
    }
  });

  afterEach(() => {
    XMLHttpRequest.restore();
  });

  it('resolve response 200', (done) => {
    ajaxJson({}).then((req) => {
      expect(req.responseBody.id).to.equal(12);
      expect(req.responseBody.comment).to.equal("Hey there");
      done();
    }).catch((e) => done(e));
    expect(requests.length).to.equal(1);
    requests[0].respond(200, { "Content-Type": "application/json" }, '{ "id": 12, "comment": "Hey there" }');
  });

  it('resolve response 404', (done) => {
    ajaxJson({}).then((req) => {
      expect(req.status).to.equal(404);
      expect(req.responseBody.id).to.equal(12);
      expect(req.responseBody.comment).to.equal("Hey there");
      done();
    }).catch((e) => done(e));
    expect(requests.length).to.equal(1);
    requests[0].respond(404, { "Content-Type": "application/json" }, '{ "id": 12, "comment": "Hey there" }');
  });

  it('resolve  invalid json', (done) => {
    ajaxJson({}).then((req) => {
      done(new Error('i should not be here'));
    },(req) => {
      expect(req.error).to.equal(ERROR_JSON);
      done();
    }).catch((e) => done(e));
    requests[0].respond(404, { "Content-Type": "application/json" }, '{ this is no json}');
  });
  it('resolve  invalid json', (done) => {
    ajaxJson({}).then((req) => {
      done(new Error('i should not be here'));
    }, (req) => {
      expect(req.error).to.equal(ERROR_REJECT);
      done();
    }).catch((e) => {
      done(e);
    });
    requests[0].respond(0);
  });
  it('request body', (done) => {
    ajaxJson({body: {test:1}}).then((req) => {
      expect(req.status).to.equal(200);
      expect(req.responseBody.id).to.equal(12);
      expect(req.responseBody.comment).to.equal("Hey there");
      expect(req.requestBody).to.equal('{"test":1}');
      done();
    }).catch((e) => done(e));
    expect(requests.length).to.equal(1);
    requests[0].respond(200, { "Content-Type": "application/json" }, '{ "id": 12, "comment": "Hey there" }');
  });

});
