# Forms: CSS Class Parser

It may be convenient to encode definition Settings as a CSS class value. We
provide (and use) a helper function to decode such Settings. This allows
designers to configure JavaScript components using CSS.

## `parseClass()`

- @param {String} class contents of an HTML 'class' attribute
- @returns {Object} key-value pairs of properties encoded in the string

The returned Object will always have a "class" property, with a String value
containing any non-Setting content (i.e. actual CSS classes). We consider
everything after the last semi-colon to be CSS classes.

If there is no semi-colon at all, then we treat the whole string as a normal CSS
class. For example, `cat dog` becomes:

```json
{
  "class": "cat dog"
}
```


Inspired by HTML attributes, we consider any Setting that does not have an
explicit value to be a Boolean Setting, with a default `true` value.

For example, `cat; dog` becomes:

```json
{
  "class": "dog",
  "cat": true
}
```

Use semi-colons to delimit Settings, and use colons to delimit Setting key-value
pairs. We ignore spaces when parsing Settings.

For example, `cats: rule; dogs: drool;` becomes:

```json
{
  "class": "",
  "cats": "rule",
  "dogs": "drool"
}
```

For multi-word Setting names, follow CSS conventions by using lower-case
kebab-style. We convert this to camelCase automatically to follow JavaScript
conventions.

For example, `multi-word: value;` becomes:

```json
{
  "class": "",
  "multiWord": "value"
}
```

## `castPropertyValues()`

- @param {Object} input key-value pairs to cast
- @param {Object} example key-value pairs where values are of desired types
- @returns {Object} a new Object with same properties as input but with cast values

The output from `parseClass()` (above) treats all values as Strings. We provide
a companion method to allow values to be cast to Boolean or Number types in
bulk.

`castPropertyValues()` will take the values from the first parameter, and cast
those values using the types found in the second parameter.

For example, `castPropertyValues({ value: '123' }, { value: 0 })` will return:

```json
{
  "value": 123
}
```

We use the built-in `parseFloat()` method to cast values to a Number, so be
aware that values that are not numeric may have unexpected results.
