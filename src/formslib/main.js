define([
  './castPropertyValues',
  './flattenDefinition',
  './parseClass'
], function (
  castPropertyValues,
  flattenDefinition,
  parseClass
) {
  'use strict';

  return {
    castPropertyValues: castPropertyValues,
    flattenDefinition: flattenDefinition,
    parseClass: parseClass
  };
});
