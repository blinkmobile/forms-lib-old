define([
  'intern!tdd',
  'chai',
  'forms'
], function (tdd, chai, forms) {
  'use strict';
  var assert;
  assert = chai.assert;

  tdd.suite('Forms', function () {
    tdd.test('', function () {
      assert(!!forms);
    });
  });

});
