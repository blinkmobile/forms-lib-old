'use strict';

/**
* @param {Object} target the object to which properties will be added
* @returns {Object} new Object with the same non-Function values
*/
function clone(target) {
  return JSON.parse(JSON.stringify(target));
}

module.exports = clone;
