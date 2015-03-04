(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.FormsLib = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

module.exports = castPropertyValues;

},{}],2:[function(require,module,exports){
'use strict';

/**
* @param {Object} target the object to which properties will be added
* @returns {Object} new Object with the same non-Function values
*/
function clone(target) {
  return JSON.parse(JSON.stringify(target));
}

module.exports = clone;

},{}],3:[function(require,module,exports){
'use strict';

var clone = require('./clone');

/**
* @private
* @param {Object} target the object to which properties will be added
* @param {Object} source the object from which properties will be copied
* @returns {Object} target
*/
function extend(target, source) {
  if (!target || typeof target !== 'object') {
    throw new TypeError('1st argument must be an Object');
  }
  if (!source || typeof source !== 'object') {
    throw new TypeError('1st argument must be an Object');
  }
  Object.keys(source).forEach(function (prop) {
    var value = source[prop];
    if (typeof value === 'string') {
      if (value) {
        target[prop] = value.trim();
      }
    } else {
      target[prop] = value;
    }
  });
  return target;
}

/**
* @private
* @param {Objects[]} objects collection of [ { name: '...', ... }, ... ]
* @param {String[]} names desired ordering / filtering of objects
* @returns {Objects[]} sorted and filtered objects
*/
function sortAndFilterByName(objects, names) {
  var result;

  // remove all elements not needed for this variation
  result = objects.filter(function (o) {
    return names.indexOf(o.name) !== -1;
  });
  // sort elements as per the variation-specific order
  result.sort(function (a, b) {
    var aIndex, bIndex;
    aIndex = names.indexOf(a.name);
    bIndex = names.indexOf(b.name);
    return aIndex - bIndex;
  });

  return result;
}

/**
 * @public
 * @param {Object} def original definition with multiple variations
 * @param {String} variation the specific variation desired
 * @return {Object} definition for a single variation
 */
function flattenDefinition(def, variation) {
  function flattenComponents(d) {
    var attrs = d['default'] || {};
    if (variation && d[variation]) {
      extend(attrs, d[variation]);
    }
    return attrs;
  }

  if (!def || typeof def !== 'object') {
    throw new TypeError('1st argument should be an Object');
  }
  if (!def['default']) {
    throw new TypeError('Object is missing the "default" property');
  }
  if (!def['default'].name || typeof def['default'].name !== 'string') {
    throw new TypeError('"default" Object is missing the "name" String');
  }

  // clone the definition object first, for safety
  def = clone(def);

  // found definition, but need to collapse to specific variation/view
  [
  '_elements',
  '_sections',
  '_pages',
  '_behaviours',
  '_checks',
  '_actions'
  ].forEach(function (components) {
    if (Array.isArray(def['default'][components])) {
      def['default'][components] = def['default'][components].map(flattenComponents);
    }
  });

  if (!variation) {
    // no further merging required
    return def['default'];
  }

  if (def[variation]) {
    if (Array.isArray(def[variation]._elements)) {
      def['default']._elements = sortAndFilterByName(def['default']._elements, def[variation]._elements);
      delete def[variation]._elements;
    }
    extend(def['default'], def[variation]);
  }

  return def['default'];
}

module.exports = flattenDefinition;

},{"./clone":2}],4:[function(require,module,exports){
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

},{}],"src/formslib/main":[function(require,module,exports){
'use strict';

module.exports = {
  castPropertyValues: require('./castPropertyValues'),
  flattenDefinition: require('./flattenDefinition'),
  parseClass: require('./parseClass')
};

},{"./castPropertyValues":1,"./flattenDefinition":3,"./parseClass":4}]},{},[])("src/formslib/main")
});