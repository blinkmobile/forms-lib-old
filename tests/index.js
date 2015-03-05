/*eslint-env node*/
'use strict';

// 3rd-party modules

require('tape');
require('tape-chai');

// this module

require('./00_init');

require('./01_flatten');

require('./02_parseClass');

require('./03_castPropertyValues');

require('./blob-uploader');
