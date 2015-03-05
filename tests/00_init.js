/*eslint-env node*/
'use strict';

var test = require('tape');

var forms = require('../src/formslib/main');

test('Forms is an object', function (t) {
  t.isObject(forms);
  t.end();
});
