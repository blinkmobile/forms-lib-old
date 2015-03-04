'use strict';

// https://github.com/angular/angular.js/blob/41b36e68/src/ng/compile.js#L706
var CLASS_REGEXP = /([\w\-]+)(?:\:([^;]+))?;?/g;

/**
* @private
* @param {String} input a String containing kebab-case, snake_case, etc
* @returns {String} a String with only camelCase
*/
function toCamelCase(input) {
  var output;
  output = input.toLowerCase().trim();
  output = output.replace(/[^a-z0-9]/g, '-');
  // now everything is kebab-case
  output = output.replace(/\W(\w)/g, function (match, p1) {
    return p1.toUpperCase();
  });
  return output;
}

/**
* @public
* @param {String} klass contents of an HTML 'class' attribute
* @returns {Object} key-value pairs of properties encoded in the string
*/
function parseClass(klass) {
  // we intentially mispell "class" to pass ES3 syntax in IE8 and under
  var lastSemicolon = klass.lastIndexOf(';');
  var result = {};
  var matches;
  var key;

  if (lastSemicolon === -1) {
    // no semi-colons, so the whole string is just basic CSS classes
    result['class'] = klass;
    return result;
  }

  result['class'] = klass.substring(lastSemicolon + 1, klass.length).trim();
  klass = klass.substring(0, lastSemicolon + 1);
  klass = klass.replace(/\s/g, '');
  klass = klass.replace(/\:;/g, ';');

  matches = CLASS_REGEXP.exec(klass);
  while (Array.isArray(matches)) {
    key = toCamelCase(matches[1]);
    if (matches[2] === undefined) {
      result[key] = true;
    } else {
      result[key] = matches[2];
    }
    matches = CLASS_REGEXP.exec(klass);
  }

  return result;
}

module.exports = parseClass;
