define([
  'intern!tdd',
  'chai',
  'forms'
], function (tdd, chai, forms) {
  'use strict';
  var assert;
  assert = chai.assert;

  tdd.suite('Forms', function () {
    tdd.test('Forms is an object', function () {
      assert.isObject(forms);
    });
  });

});
