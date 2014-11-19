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
    var keys;
    var values;

    tdd.before(function () {
      fixtures = [
        'cat',
        'cat dog',
        'bird cat dog',
        'bird: cat; dog',
        'bird; cat dog',
        'bird; cat:; dog',
        'bird-cat; dog',
        'bird-cat: dog;'
      ];
      classes = [
        'cat',
        'cat dog',
        'bird cat dog',
        'dog',
        'cat dog',
        'dog',
        'dog',
        ''
      ];
      keys = [
        [ 'class' ],
        [ 'class' ],
        [ 'class' ],
        [ 'class', 'bird' ],
        [ 'class', 'bird' ],
        [ 'class', 'bird', 'cat' ],
        [ 'class', 'birdCat' ],
        [ 'class', 'birdCat' ]
      ];
      values = [ // [0] is not checked, as we have separate class tests
        [ null ],
        [ null ],
        [ null ],
        [ null, 'cat' ],
        [ null, true ],
        [ null, true, true ],
        [ null, true ],
        [ null, 'dog' ]
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

    tdd.test('result Object has expected keys', function () {
      var i = fixtures.length;
      var result;
      while (i > 0) {
        i -= 1;
        result = Forms.parseClass(fixtures[i]);
        assert.isObject(result);
        assert.sameMembers(
          Object.keys(result), keys[i],
          fixtures[i] + ' => Object.keys(' + JSON.stringify(result) + ') != ' + JSON.stringify(keys[i])
        );
      }
    });

    tdd.test('result Object has expected values', function () {
      var i = fixtures.length;
      var j;
      var result;
      while (i > 0) {
        i -= 1;
        result = Forms.parseClass(fixtures[i]);
        assert.isObject(result);
        j = keys[i].length;
        while (j > 1) { // skip [0] because we have separate class tests
          j -= 1;
          assert.property(
            result,
            keys[i][j],
            JSON.stringify(fixtures[i]) + ' has property ' + keys[i][j]
          );
          assert.equal(result[keys[i][j]], values[i][j], JSON.stringify(result));
        }
      }
    });

  });

});
