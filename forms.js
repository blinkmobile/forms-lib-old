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
      target[prop] = source[prop];
    });
    return target;
  }

  /**
   * @param {Object} def original definition with multiple variations
   * @param {String} variation the specific variation desired
   * @return {Object} definition for a single variation
   */
  Forms.flattenDefinition = function flattenDefinition(def, variation) {
    var elements, elNames;

    function collapseAction(d) {
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
        def['default'][components] = def['default'][components].map(collapseAction);
      }
    });

    if (!variation) {
      // no further merging required
      return def['default'];
    }

    if (def[variation] && def[variation]._elements) {
      elements = def['default']._elements;
      delete def['default']._elements;
      elNames = def[variation]._elements;
      delete def[variation]._elements;
      extend(def['default'], def[variation]);

      // remove all elements not needed for this variation
      elements = elements.filter(function (el) {
        return elNames.indexOf(el['default'].name) !== -1;
      });
      // sort elements as per the variation-specific order
      elements.sort(function (a, b) {
        var aIndex, bIndex;
        aIndex = elNames.indexOf(a['default'].name);
        bIndex = elNames.indexOf(b['default'].name);
        return aIndex - bIndex;
      });

      def['default']._elements = elements;
    }

    return def['default'];
  };

  return Forms;
});
