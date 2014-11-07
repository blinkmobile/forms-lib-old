define([
  'intern!tdd',
  'chai',
  'forms'
], function (tdd, chai, Forms) {
  'use strict';
  var assert;
  assert = chai.assert;

  tdd.suite('Forms.flattenDefinition', function () {

    tdd.test('flattenDefinition is a function', function () {
      assert.isFunction(Forms.flattenDefinition);
    });

  });

  tdd.suite('flattening', function () {
    var def, flat;

    tdd.before(function () {
      def = {
        'default': {
          name: 'my-form',
          _elements: [
            {
              'default': {
                name: 'my-element'
              }
            }
          ]
        },
        add: {}
      };
      flat = Forms.flattenDefinition(def, 'add');
    });

    tdd.test('output is an Object', function () {
      assert.isObject(flat);
    });

    tdd.test('properties in default are flattened as expected', function () {
      assert.notProperty(flat, 'default');
      assert.isString(flat.name);
      assert.equal(flat.name, def['default'].name);
    });

    tdd.test('components in default are flattened as expected', function () {
      var el;
      assert.isArray(flat._elements);
      assert.lengthOf(flat._elements, 1);
      el = flat._elements[0];
      assert.notProperty(el, 'default');
      assert.isString(el.name);
      assert.equal(el.name, def['default']._elements[0]['default'].name);
    });

//    tdd.test('_elements listing in a variation is used as expected');

  });

});
