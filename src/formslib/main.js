define([
  './flattenDefinition',
  './parseClass'
], function (flattenDefinition, parseClass) {
  'use strict';

  return {
    flattenDefinition: flattenDefinition,
    parseClass: parseClass
  };
});
