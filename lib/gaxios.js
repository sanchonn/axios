/**
 * Google protocol buffer extension for axios
 *
 */

// Dependecies
const axios = require('./axios');
const gbuffer = require('./helpers/gbuffer');

/**
 * Method that create request to the url with payload plain json,
 * that converted to Google protocol buffer, and returned Google protocol buffer to the plain json
 *
 * @param {string} url url address
 * @param {string} method method for request
 * @param {string} protoFile .proto file which describes format of buffer
 * @param {string} message Google protocol buffer message from .proto file
 * @param {object} options options like headers and etc
 * @returns {Promise} result of axios.get and decoding Google protocol buffer buffer to plain json
 */
axios.requestGbuf = (url, method, payload, protoFile, message, options = {}) => new Promise((resolve, reject) => {
  // Check params
  url = typeof (url) === 'string' && url.trim().length > 0 ? url : false;
  method = typeof (method) === 'string'
    && method.trim().length > 0
    && ['delete', 'get', 'post', 'put', 'patch'].indexOf(method > -1)
    ? method : false;
  protoFile = typeof (protoFile) === 'string' && protoFile.trim().length > 0 ? protoFile : false;
  message = typeof (message) === 'string' && message.trim().length > 0 ? message : false;
  // Common options to request
  options.method = method;
  options.url = url;
  options.responseType = 'arraybuffer';
  //console.log(url, method, protoFile, message);
  if (url && method && protoFile && message) {
    // Handler for method with no payload
    if (['delete', 'get', 'head', 'options'].indexOf(method) > -1) {
      axios(options)
        // Check response object
        .then(response => new Uint8Array(response.data, 0, response.data.length))
        .then((data) => {
          resolve(gbuffer.decode(data, protoFile, message));
        })
        // Error handler
        .catch((err) => {
          reject(err);
        });
    } else {
      // Handler for method (post, put, patch) with payload
      gbuffer.encode(payload, protoFile, message)
        // Send built-in axios requst
        .then((data) => {
          // Options to send data
          data = (typeof window === 'undefined') ? data : data.buffer.slice(0, data.length);
          options.data = data;
          options.headers = { 'Content-Type': 'application/octet-stream' };
          return axios(options);
        })
        // Check response object
        .then(response => new Uint8Array(response.data, 0, response.data.length))
        .then((data) => {
          // Return decoded from Gbuf to plain json
          resolve(gbuffer.decode(data, protoFile, message));
        })
        // Error handler
        .catch((err) => {
          reject(err);
        });
    }
  } else {
    // Reject if one of the params is invalid
    reject(new Error('Function params are invalid'));
  }
});


/**
 * Add methods that 'delete', 'get'
 * from ulr Google protocol buffer buffer and convert it to the plain json
 *
 * @param {*} url url address
 * @param {*} protoFile .proto file which describes format of buffer
 * @param {*} message Google protocol buffer message from .proto file
 * @param {object} options options like headers and etc
 * @returns {Promise} result of axios.get and decoding Google protocol buffer buffer to plain json
 */
axios.getGbuf = (url, protoFile, message, options = {}) => axios.requestGbuf(url, 'get', {}, protoFile, message, options);
axios.deleteGbuf = (url, protoFile, message, options = {}) => axios.requestGbuf(url, 'delete', {}, protoFile, message, options);

/**
 * Add methods that 'post', 'put', 'patch' Google protocol buffer to ulr
 * and convert returned Google protocol buffer to the plain json
 *
 * @param {*} url url address
 * @param {*} protoFile .proto file which describes format of buffer
 * @param {*} message Google protocol buffer message from .proto file
 * @param {object} options options like headers and etc
 * @returns {Promise} result of axios.get and decoding Google protocol buffer to plain json
 */
axios.postGbuf = (url, payload, protoFile, message, options = {}) => axios.requestGbuf(url, 'post', payload, protoFile, message, options);
axios.putGbuf = (url, payload, protoFile, message, options = {}) => axios.requestGbuf(url, 'put', payload, protoFile, message, options);
axios.patchGbuf = (url, payload, protoFile, message, options = {}) => axios.requestGbuf(url, 'patch', payload, protoFile, message, options);

// Export the module
module.exports = axios;
