define([], function () {
  'use strict';

  var Forms;
  Forms = {};

  /**
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
   * @param {String} klass contents of an HTML 'class' attribute
   * @returns {Object} key-value pairs of properties encoded in the string
   */
  Forms.parseClass = function parseClass(klass) {
    var lastSemicolon = klass.lastIndexOf(';');
    var result = {};
    if (lastSemicolon === -1) {
      // no semi-colons, so the whole string is just basic CSS classes
      return {
        'class': klass
      };
    }
    result['class'] = klass.substring(lastSemicolon + 1, klass.length).trim();
    return result;
  };

  return Forms;
});
