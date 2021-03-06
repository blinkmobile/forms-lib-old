/*eslint-disable no-underscore-dangle*/ // "_elements" is part of our spec
'use strict';

// 3rd-party modules

var test = require('tape');

// our modules

var Forms = require('../src/formslib/main');

// this module

test('Forms.flattenDefinition', function (t) {

  t.test('flattenDefinition is a function', function (tt) {
    tt.isFunction(Forms.flattenDefinition);
    tt.end();
  });

  t.test('throws an error for bad argument[0]', function (tt) {
    tt['throws'](function () {
      Forms.flattenDefinition(null);
    }, Error);
    tt['throws'](function () {
      Forms.flattenDefinition({});
    }, Error);
    tt['throws'](function () {
      Forms.flattenDefinition({ 'default': {} });
    }, Error);
    tt.end();
  });

  t.end();
});

test('flattening', function (t) {
  var def, flat;

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
    }
  };
  flat = Forms.flattenDefinition(def);

  t.test('output is an Object', function (tt) {
    tt.isObject(flat);
    tt.end();
  });

  t.test('properties in default are flattened as expected', function (tt) {
    tt.notProperty(flat, 'default');
    tt.isString(flat.name);
    tt.equal(flat.name, def['default'].name);
    tt.end();
  });

  t.test('components in default are flattened as expected', function (tt) {
    var el;
    tt.isArray(flat._elements);
    tt.lengthOf(flat._elements, 1);
    el = flat._elements[0];
    tt.notProperty(el, 'default');
    tt.isString(el.name);
    tt.equal(el.name, def['default']._elements[0]['default'].name);
    tt.end();
  });

  t.end();
});

test('flattening with variations', function (t) {
  var def, flat;

  def = {
    'default': {
      name: 'my-form',
      _elements: [
        {
          'default': {
            name: 'element-1'
          },
          add: {
            label: 'Element 1'
          }
        },
        {
          'default': {
            name: 'element-2'
          },
          edit: {
            label: 'Element 2'
          }
        },
        {
          'default': {
            name: 'element-3'
          },
          list: {
            label: 'Element 3'
          }
        }
      ]
    },
    add: {
      label: 'My Form',
      _elements: [
        'element-2',
        'element-1'
      ]
    }
  };
  flat = Forms.flattenDefinition(def, 'add');

  t.test('output is an Object', function (tt) {
    tt.isObject(flat);
    tt.end();
  });

  t.test('properties in default are flattened as expected', function (tt) {
    tt.isString(flat.label);
    tt.equal(flat.label, def.add.label);
    tt.end();
  });

  t.test('_elements listing in a variation controls order', function (tt) {
    var original;
    tt.lengthOf(flat._elements, 2);
    original = def['default']._elements[1];
    tt.isString(flat._elements[0].name);
    tt.equal(flat._elements[0].name, original['default'].name);
    original = def['default']._elements[0];
    tt.isString(flat._elements[1].label);
    tt.equal(flat._elements[1].label, original.add.label);
    tt.end();
  });

  t.end();
});

test('precedence', function (t) {
  var def;

  def = {
    'default': {
      name: 'my-form',
      string: 'My Form',
      'boolean': true,
      number: 1
    },
    add: {
      string: '',
      'boolean': false,
      number: 0
    },
    edit: {
      string: ' '
    }
  };

  t.test('"add" Variation is flattened as expected', function (tt) {
    var flat = Forms.flattenDefinition(def, 'add');

    tt.property(flat, 'name');
    tt.isString(flat.name);
    tt.equal(flat.name, def['default'].name);

    // default.string is used because add.string is empty
    tt.property(flat, 'string');
    tt.isString(flat.string);
    tt.equal(flat.string, def['default'].string);

    tt.property(flat, 'boolean');
    tt.isBoolean(flat['boolean']);
    tt.equal(flat['boolean'], def.add['boolean']);

    tt.property(flat, 'number');
    tt.isNumber(flat.number);
    tt.equal(flat.number, def.add.number);
    tt.end();
  });

  t.test('"edit" Variation is flattened as expected', function (tt) {
    var flat = Forms.flattenDefinition(def, 'edit');

    tt.property(flat, 'name');
    tt.isString(flat.name);
    tt.equal(flat.name, def['default'].name);

    // edit.string is used because it is not empty
    tt.property(flat, 'string');
    tt.isString(flat.string);
    tt.equal(flat.string, def.edit.string.trim());

    tt.property(flat, 'boolean');
    tt.isBoolean(flat['boolean']);
    tt.equal(flat['boolean'], def['default']['boolean']);

    tt.property(flat, 'number');
    tt.isNumber(flat.number);
    tt.equal(flat.number, def['default'].number);
    tt.end();
  });

  t.end();
});
