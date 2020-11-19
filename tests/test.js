const assert = require('assert');
jest.mock('isomorphic-unfetch', () => require('fetch-mock-jest').sandbox());
const fetchMock = require("isomorphic-unfetch");
const Ucentric = require('../');

const instanceOpts = {
  publicKey: "mypubkey",
  secretKey: "myseckey",
  basePath: "https://test.ucentric.io"
};

const authString = 'Basic ' + Buffer.from(
  instanceOpts.publicKey + ':' + instanceOpts.secretKey
).toString('base64');


describe('Ucentric', () => {
  let instance, scope;

  afterEach(() => {
    fetchMock.restore();
  });

  describe('constructor', () => {

    describe("setting the base path option", () => {
      describe("when base path is passed", () => {
        beforeEach(() => {
          instance = new Ucentric(instanceOpts);
        });

        it('sets the base path', () => {
          assert.equal(instance.basePath, instanceOpts.basePath);
        });
      });

      describe("when base path is not passed", () => {
        beforeEach(() => {
          let opts = { ...instanceOpts };
          delete opts.basePath;
          instance = new Ucentric(opts);
        });

        it('sets the base path', () => {
          assert.equal(instance.basePath, "https://api.ucentric.io");
        });
      });
    });

    describe("setting the basic authentication string", () => {
      beforeEach(() => {
        instance = new Ucentric(instanceOpts);
      });

      it('sets the auth property to a base64 encoded string', () => {
        const authString = 'Basic ' + Buffer.from(
          instanceOpts.publicKey + ':' + instanceOpts.secretKey
        ).toString('base64');

        assert.equal(
          instance.auth,
          authString
        );
      });
    });
  });

  describe("request()", () => {
    beforeEach(() => {
      instance = new Ucentric(instanceOpts);
      fetchMock.mock(instance.basePath + "/test", { test: true });
    });

    it('sets the correct url and headers', (done) => {
      instance.request('/test', {
        method: 'GET'
      }).then(() => {
        done();
      });
    });
  });

  describe("getNudgesByReference()", () => {
    beforeEach(() => {
      instance = new Ucentric(instanceOpts);
      fetchMock.mock({
        url: instance.basePath + "/app/api/v1/nudges",
        query: { reference: "123" }
      }, [{ ID: 1 }]);
    });

    it('sets the correct url and method and returns the nudges', (done) => {
      instance.getNudgesByReference("123").then((nudges) => {
        assert.deepEqual(nudges, [{ ID: 1 }]);
        done();
      });
    });
  });


  describe("createNudge()", () => {
    beforeEach(() => {
      instance = new Ucentric(instanceOpts);
      fetchMock.mock({
        url: instance.basePath + "/app/api/v1/nudges",
        method: 'POST'
      }, { usage: 22 });
    });

    it('sets the correct url and method', () => {
      let nudge = { Body: "hello world" };

      instance.createNudge(nudge).then((res) => {
        assert.deepEqual(res, { usage: 22 });
        done();
      });
    });
  });
});
