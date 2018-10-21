/**
 * Unit test for testing the google protocol buffer extension for axios module
 *
 */

// Dependencies
var axios = require('../../../index');
var http = require('http');
var assert = require('assert');
const gbuffer = require('../../../lib/helpers/gbuffer');

let server;

// Describe the test
describe('test axios google protocol buffer extension', () => {

  // Close the server for each test
  afterEach(() => {
    if (server) {
      server.close();
      server = null;
    }
  });
  // Check axios.getGbuf method
  it('should properly get and decode payload', (done) => {
    // Sample for checking
    const sample = {
      text: 'test'
    };
    // Create test server
    server = http.createServer((req, res) => {
      if (req.method === 'GET') {
        gbuffer.encode(sample, 'test.proto', 'Message')
          .then((bufCode) => {
            res.write(bufCode);
            res.end();
          });
      }
    }).listen(4444, () => {
      // Get object from the test server
      axios.getGbuf('http://localhost:4444/', 'test.proto', 'Message').then((res) => {
        // Compare sample and decoded res
        assert.deepEqual(res, sample);
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });

  // Check axios.deleteGbuf method
  it('should properly delete method and decode payload', (done) => {
    // Sample for checking
    const sample = {
      text: 'test'
    };
    // Create test server
    server = http.createServer((req, res) => {
      if (req.method === 'DELETE') {
        gbuffer.encode(sample, 'test.proto', 'Message')
          .then((bufCode) => {
            res.write(bufCode);
            res.end();
          });
      }
    }).listen(4444, () => {
      // Get object from the test server
      axios.deleteGbuf('http://localhost:4444/', 'test.proto', 'Message').then((res) => {
        // Compare sample and decoded res
        assert.deepEqual(res, sample);
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });


  // Check post method with google proto buffer payload
  it('should properly post method and decode response', (done) => {
    // Sample for checking
    const sample = {
      text: 'test'
    };

    server = http.createServer((req, res) => {
      req.on('data', (data) => {
        gbuffer.decode(data, 'test.proto', 'Message')
          .then((bufDecode) => {
            assert.deepEqual(sample, bufDecode);
          });
      });
      if (req.method === 'POST') {
        gbuffer.encode(sample, 'test.proto', 'Message')
          .then((codedBuf) => {
            res.write(codedBuf);
            res.end();
          });
      }
    }).listen(4444, () => {
      // Payload
      axios.postGbuf('http://localhost:4444/', sample, 'test.proto', 'Message').then((res) => {
        assert.deepEqual(res, sample);
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });

  // Check put method with google proto buffer payload
  it('should properly put method and decode response', (done) => {
    // Sample for checking
    const sample = {
      text: 'test'
    };

    server = http.createServer((req, res) => {
      req.on('data', (data) => {
        gbuffer.decode(data, 'test.proto', 'Message')
          .then((bufDecode) => {
            assert.deepEqual(sample, bufDecode);
          });
      });
      if (req.method === 'PUT') {
        gbuffer.encode(sample, 'test.proto', 'Message')
          .then((codedBuf) => {
            res.write(codedBuf);
            res.end();
          });
      }
    }).listen(4444, () => {
      // Payload
      axios.putGbuf('http://localhost:4444/', sample, 'test.proto', 'Message').then((res) => {
        assert.deepEqual(res, sample);
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });

  // Check patch method with google proto buffer payload
  it('should properly patch method and decode response', (done) => {
    // Sample for checking
    const sample = {
      text: 'test'
    };

    server = http.createServer((req, res) => {
      req.on('data', (data) => {
        gbuffer.decode(data, 'test.proto', 'Message')
          .then((bufDecode) => {
            assert.deepEqual(sample, bufDecode);
          });
      });
      if (req.method === 'PATCH') {
        gbuffer.encode(sample, 'test.proto', 'Message')
          .then((codedBuf) => {
            res.write(codedBuf);
            res.end();
          });
      }
    }).listen(4444, () => {
      // Payload
      axios.patchGbuf('http://localhost:4444/', sample, 'test.proto', 'Message').then((res) => {
        assert.deepEqual(res, sample);
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });

});
