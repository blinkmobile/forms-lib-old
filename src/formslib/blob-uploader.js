'use strict';

// Node.js built-ins

var events = require('events');
var EventEmitter = events.EventEmitter;

// 3rd-party modules

var async = require('async');
var uuid = require('node-uuid');
var xhr;

// this module

var DEFAULT_CONCURRENCY = 3;
var endpoint = '';

var bu = new EventEmitter();

var queue = async.priorityQueue(function (blob, callback) {
  xhr({
    method: 'POST',
    url: endpoint,
    json: blob
  }, function (err, res, body) {
    var out = null;
    if (res && res.statusCode === 200) {
      out = bu.makeSavedBlob(body);
    } else {
      err = err || new Error(res.statusCode);
    }
    callback(err, out);
  });
}, DEFAULT_CONCURRENCY);

// export events from queue
['empty', 'drain', 'saturated'].forEach(function (event) {
  queue[event] = function () {
    bu.emit(event);
  };
});

// expose access to queue methods
['length', 'idle', 'pause', 'resume', 'running'].forEach(function (fn) {
  bu[fn] = function () {
    return queue[fn]();
  };
});

bu.setXHR = function (x) {
  xhr = x || require('xhr');
  return xhr;
};

bu.setConcurrency = function (num) {
  if (typeof num !== 'number' || isNaN(num)) {
    queue.concurrency = DEFAULT_CONCURRENCY;
  } else {
    queue.concurrency = num;
  }
  return queue.concurrency;
};

bu.setEndpoint = function (url) {
  if (!url || typeof url !== 'string') {
    endpoint = '';
  } else {
    endpoint = url;
  }
  return endpoint;
};

bu.saveBlob = function (blob, callback) {
  blob.blob = blob.blob || uuid.v4();
  queue.push(blob, 10, callback);
};

/*eslint-disable no-underscore-dangle*/ // server response format
bu.makeSavedBlob = function (blob) {
  var out = {
    blob: blob.blob || blob._blob,
    mime: blob.mime || blob._mime,
    size: blob.size || blob._size,
    file: blob.file || blob._data,
    width: blob.width || blob._width,
    height: blob.height || blob._height
  };
  return out;
};
/*eslint-enable no-underscore-dangle*/

module.exports = bu;
