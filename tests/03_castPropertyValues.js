define([
  'intern!tdd',
  'chai',
  'forms'
], function (tdd, chai, Forms) {
  'use strict';
  var assert;
  assert = chai.assert;

  tdd.suite('Forms.castPropertyValues', function () {

    tdd.test('is a function', function () {
      assert.isFunction(Forms.castPropertyValues);
    });

    tdd.test('throws an error for bad parameters', function () {
      assert.throws(function () {
        Forms.castPropertyValues(null, null);
      }, Error);
      assert.throws(function () {
        Forms.castPropertyValues({}, null);
      }, Error);
      assert.throws(function () {
        Forms.castPropertyValues(null, {});
      }, Error);
    });

  });

  tdd.suite('casting values', function () {
    var fixture;
    var example;
    var values;
    var result;

    tdd.before(function () {
      fixture = {
        b: true,
        b2b: true,
        b2n: true,
        b2s: true,
        n: 123,
        n2b: 123,
        n2n: 123,
        n2s: 123,
        s: 'abc',
        s2b: 'true',
        s2n: '123',
        s2s: 'abc',
        object: {},
        array: []
      };
      example = {
        missing: true,
        b2b: false,
        b2n: 0,
        b2s: '',
        n2b: false,
        n2n: 0,
        n2s: '',
        s2b: false,
        s2n: 0,
        s2s: '',
        object: '',
        array: ''
      };
      values = {
        b2n: 1,
        b2s: 'true',
        n2b: true,
        n2s: '123',
        s2b: true,
        s2n: 123,
        // expect these to be the originals
        b: true,
        b2b: true,
        n: 123,
        n2n: 123,
        s: 'abc',
        s2s: 'abc',
        object: fixture.object,
        array: fixture.array
      };
      result = Forms.castPropertyValues(fixture, example);
    });

    tdd.test('input and output share same number of properties', function () {
      assert.lengthOf(Object.keys(result), Object.keys(fixture).length);
    });

    tdd.test('input and output have same set of keys', function () {
      assert.sameMembers(Object.keys(fixture), Object.keys(result));
    });

    tdd.test('results have expected types', function () {
      var prop;
      var value;
      for (prop in values) {
        if (values.hasOwnProperty(prop)) {
          assert.property(result, prop, '[' + prop + ']');
          value = values[prop];
          switch (typeof value) {
            case 'boolean':
              assert.isBoolean(result[prop]);
              break;
            case 'number':
              assert.isNumber(result[prop]);
              break;
            case 'string':
              assert.isString(result[prop]);
              break;
            default:
              assert.equal(
                fixture[prop],
                result[prop],
                '[' + prop + '] unchanged due to non-primitive type');
          }
          if (!Array.isArray(value) || typeof value !== 'object') {
            assert.equal(result[prop], value, '[' + prop + ']');
          }
        }
      }
    });

  });

});
