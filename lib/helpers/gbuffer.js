/**
 * Helpers for encode/decode plain json to/from grpc buffer
 *
 */

// Dependencies
const protobuf = require('protobufjs');

// Container
const gbuffer = {};
/**
 * Encode plain object to grpc buffer
 *
 * @param {String} payload json string to convert to grpc format
 * @param {String} protoFile protoFile.proto contains file in proto3 syntax
 * @param {String} message message that is described int proto file
 * @returns Promise
 *
 */
gbuffer.encode = (payload, protoFile, message) => new Promise((resolve, reject) => {
  // Check the protoFile
  if (protoFile || protoFile.length === 0) {
    // Load protoFile
    protobuf.load(protoFile, (err, root) => {
      if (err) {
        reject(new Error(err));
      }
      // Obtain a message type
      const ProtoMessage = root.lookupType(message);
      // Verify the payload
      const errMsg = ProtoMessage.verify(payload);
      if (errMsg) {
        reject(new Error(errMsg));
      }
      // Encode a message
      const buffer = ProtoMessage.encode(ProtoMessage.create(payload)).finish();
      resolve(buffer);
    });
  } else {
    // Return error
    reject(new Error('There is not any protoFile'));
  }
});

/**
 * Decode the grpc buffer to plain object
 *
 * @param {String} payload json string to convert to grpc format
 * @param {String} protoFile protoFile.proto contains file in proto3 syntax
 * @param {String} message message that is described int proto file
 * @returns Promise
 *
 */
gbuffer.decode = (payload, protoFile, message) => new Promise((resolve, reject) => {
  // Check the protoFile
  if (protoFile || protoFile.length === 0) {
    // Load protoFile
    protobuf.load(protoFile, (err, root) => {
      if (err) {
        reject(new Error(err));
      }
      // Obtain a message type
      const ProtoMessage = root.lookupType(message);
      // Decode a message
      const buffer = ProtoMessage.decode(payload);
      // Convert buffer to plain object
      const object = ProtoMessage.toObject(buffer, {
        enums: String,  // enums as string names
        longs: String,  // longs as strings (requires long.js)
        bytes: String,  // bytes as base64 encoded strings
        defaults: true, // includes default values
        arrays: true,   // populates empty arrays (repeated fields) even if defaults=false
        objects: true,  // populates empty objects (map fields) even if defaults=false
        oneofs: true    // includes virtual oneof fields set to the present field's name
      });
      resolve(object);
    });
  } else {
    // Return error
    reject(new Error('There is not any protoFile'));
  }
});


// Export the module
module.exports = gbuffer;
