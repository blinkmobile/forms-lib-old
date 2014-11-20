define([], function () {
  'use strict';

  var SKIP_TYPES = ['array', 'function', 'object'];

  var FALSE_VALUES = [ 0, '0', '', 'false', null, undefined ];

  var CAST = {
    'boolean': function toBoolean(value) {
      if (FALSE_VALUES.indexOf(value) !== -1) {
        return false;
      }
      return true;
    },
    'number': function toNumber(value) {
      var output;
      if (typeof value === 'boolean') {
        return value ? 1 : 0;
      }
      output = parseFloat(value);
      // it's safe to use isNaN() on actual Number values
      return isNaN(output) ? 0 : output;
    },
    'string': function toString(value) {
      if (value && typeof value === 'object' && value.toString) {
        return value.toString();
      }
      return '' + value;
    }
  };

  /**
  * @param {Object} input key-value pairs to cast
  * @param {Object} example key-value pairs where values are of desired types
  * @returns {Object} a new Object with same properties as input but with cast values
  */
  function castPropertyValues(input, example) {
    var output;
    if (!input || typeof input !== 'object') {
      throw new TypeError('1st argument must be an Object');
    }
    if (!example || typeof example !== 'object') {
      throw new TypeError('1st argument must be an Object');
    }
    output = {};
    Object.keys(input).forEach(function (prop) {
      var type;
      if (!input.hasOwnProperty(prop)) {
        return; // no property to cast
      }
      if (!example.hasOwnProperty(prop)) {
        output[prop] = input[prop];
        return; // no example from which to derive type
      }
      type = typeof example[prop];
      if (SKIP_TYPES.indexOf(type) !== -1 || typeof input[prop] === type) {
        output[prop] = input[prop];
        return; // nothing further to do for these types
      }
      output[prop] = CAST[type](input[prop]);
    });
    return output;
  }

  return castPropertyValues;
});
