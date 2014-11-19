define([], function () {
  'use strict';

  var Forms = {};
  // https://github.com/angular/angular.js/blob/41b36e68/src/ng/compile.js#L706
  var CLASS_REGEXP = /([\w\-]+)(?:\:([^;]+))?;?/g;

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
   * @param {Object} def original definition with multiple variations
   * @param {String} variation the specific variation desired
   * @return {Object} definition for a single variation
   */
  Forms.flattenDefinition = function flattenDefinition(def, variation) {
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
    def = JSON.parse(JSON.stringify(def));

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
  };

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
   * @param {String} klass contents of an HTML 'class' attribute
   * @returns {Object} key-value pairs of properties encoded in the string
   */
  Forms.parseClass = function parseClass(klass) {
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
  };

  return Forms;
});
