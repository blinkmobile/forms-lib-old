'use strict';

// 3rd-party modules

var test = require('tape');

// our modules

var Forms = require('../src/formslib/main');

// this module

var fixtureServerBlob = {
  blob: 'b',
  mime: 'c',
  file: 'd',
  size: 1,
  width: 2,
  height: 3
};

var quickFailXHR = function (opts, callback) {
  setTimeout(function () {
    callback(new Error('failed!'));
  }, 0);
  return {};
};
var quickPassXHR = function (opts, callback) {
  setTimeout(function () {
    callback(null, { statusCode: 200 }, fixtureServerBlob);
  }, 0);
  return {};
};
/*eslint-disable no-underscore-dangle*/ // legacy server result has _prefix
var quickPassLegacyXHR = function (opts, callback) {
  setTimeout(function () {
    callback(null, { statusCode: 200 }, {
      _blob: 'b',
      _mime: 'c',
      _data: 'd',
      _size: 1,
      _width: 2,
      _height: 3
    });
  }, 0);
  return {};
};
/*eslint-enable no-underscore-dangle*/

test('Forms.blobUploader', function (t) {

  t.test('is an Object', function (tt) {
    tt.isObject(Forms.blobUploader);
    tt.end();
  });

  t.test('has a `on()` method', function (tt) {
    tt.isFunction(Forms.blobUploader.on);
    tt.end();
  });

  t.test('has a `once()` method', function (tt) {
    tt.isFunction(Forms.blobUploader.once);
    tt.end();
  });

  t.test('has an `emit()` method', function (tt) {
    tt.isFunction(Forms.blobUploader.emit);
    tt.end();
  });

  t.test('has queue\'s `length()` method', function (tt) {
    tt.isFunction(Forms.blobUploader.length);
    tt.equal(Forms.blobUploader.length(), 0, 'queue is initially empty');
    tt.end();
  });

  t.test('has queue\'s `idle()` method', function (tt) {
    tt.isFunction(Forms.blobUploader.idle);
    tt.end();
  });

  t.test('has queue\'s `pause()` method', function (tt) {
    tt.isFunction(Forms.blobUploader.pause);
    tt.end();
  });

  t.test('has queue\'s `resume()` method', function (tt) {
    tt.isFunction(Forms.blobUploader.resume);
    tt.end();
  });

  t.test('has queue\'s `running()` method', function (tt) {
    tt.isFunction(Forms.blobUploader.running);
    tt.end();
  });

  t.end();
});

test('Forms.blobUploader with failing XHR', function (t) {

  t.test('can use failing XHR', function (tt) {
    var result = Forms.blobUploader.setXHR(quickFailXHR);
    tt.equal(result, quickFailXHR);
    tt.end();
  });

  t.test('failed upload eventually emits "drain" event', function (tt) {
    Forms.blobUploader.once('drain', function () {
      tt.end();
    });
    Forms.blobUploader.saveBlob({});
  });

  t.test('failed upload eventually calls callback', function (tt) {
    Forms.blobUploader.saveBlob({}, function (err) {
      tt.ok(err);
      tt.end();
    });
  });

  t.end();
});

test('Forms.blobUploader with passing XHR', function (t) {

  t.test('can use passing XHR', function (tt) {
    var result = Forms.blobUploader.setXHR(quickPassXHR);
    tt.equal(result, quickPassXHR);
    tt.end();
  });

  t.test('passed upload eventually emits "drain" event', function (tt) {
    Forms.blobUploader.once('drain', function () {
      tt.end();
    });
    Forms.blobUploader.saveBlob({});
  });

  t.test('passed upload eventually emits "xhr" event', function (tt) {
    var xhrHandler = function (xhr, blob) {
      if (blob.blob === 'abc') {
        Forms.blobUploader.removeListener('xhr', xhrHandler);
        tt.ok(xhr);
        tt.end();
      }
    };
    Forms.blobUploader.on('xhr', xhrHandler);
    Forms.blobUploader.saveBlob({ blob: 'abc' });
  });

  t.test('passed upload eventually calls callback', function (tt) {
    Forms.blobUploader.saveBlob({}, function (err, blob) {
      tt.notOk(err);
      tt.isObject(blob);
      tt.deepEqual(blob, fixtureServerBlob);
      tt.end();
    });
  });

  t.end();
});

test('Forms.blobUploader with passing legacy XHR', function (t) {

  t.test('can use passing XHR', function (tt) {
    var result = Forms.blobUploader.setXHR(quickPassLegacyXHR);
    tt.equal(result, quickPassLegacyXHR);
    tt.end();
  });

  t.test('passed upload eventually emits "drain" event', function (tt) {
    Forms.blobUploader.once('drain', function () {
      tt.end();
    });
    Forms.blobUploader.saveBlob({});
  });

  t.test('passed upload eventually emits "xhr" event', function (tt) {
    var xhrHandler = function (xhr, blob) {
      if (blob.blob === 'abc') {
        Forms.blobUploader.removeListener('xhr', xhrHandler);
        tt.ok(xhr);
        tt.end();
      }
    };
    Forms.blobUploader.on('xhr', xhrHandler);
    Forms.blobUploader.saveBlob({ blob: 'abc' });
  });

  t.test('passed upload eventually calls callback', function (tt) {
    Forms.blobUploader.saveBlob({}, function (err, blob) {
      tt.error(err);
      tt.isObject(blob);
      tt.deepEqual(blob, fixtureServerBlob, 'legacy _prefix format converted');
      tt.end();
    });
  });

  t.end();
});
