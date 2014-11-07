// this is just a shim to hook up assertive-chai to node-assert correctly
(function (root) {
  'use strict';
  define(['node_modules/assert/assert.js'], function () {
    return root.assert;
  });
}(this));
