# Forms

methods and documentation for dealing with Forms

## Compatibility

This library assumes ECMAScript 5 support, specifically `Array#forEach` and
related traversal methods.

We try to avoid breaking ECMAScript 3 syntax rules, e.g. use of reserved
keywords as property names with dot-notation property-access.

Provided the ES5 APIs are poly-filled, this library should function as expected
in pre-ES5 environments such as Internet Explorer 8.
