define([
  'intern!tdd',
  'chai',
  'forms'
], function (tdd, chai, Forms) {
  'use strict';
  var assert;
  assert = chai.assert;

  tdd.suite('Forms.parseClass', function () {

    tdd.test('is a function', function () {
      assert.isFunction(Forms.parseClass);
    });

  });

  tdd.suite('parsing class strings', function () {
    var fixtures;
    var classes;

    tdd.before(function () {
      fixtures = [
        'cat',
        'cat dog',
        'bird cat dog',
        'bird: cat; dog',
        'bird; cat dog',
        'bird; cat:; dog'
      ];
      classes = [
        'cat',
        'cat dog',
        'bird cat dog',
        'dog',
        'cat dog',
        'dog'
      ];
    });

    tdd.test('result has expected CSS class(es)', function () {
      var i = fixtures.length;
      var result;
      while (i > 0) {
        i -= 1;
        result = Forms.parseClass(fixtures[i]);
        assert.isObject(result);
        assert.property(result, 'class');
        assert.equal(result.class, classes[i]);
      }
    });

  });

});
