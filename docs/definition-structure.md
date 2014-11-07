# Forms: Definition Structure

We expect Forms definitions to be valid JSON. This document explains the
expected structure of this JSON.

For low-level validation, see the
[JSON Schema specification](http://json-schema.org/) and our JSON
[schema](schema.json).


## Defaults and Variations

The property names at the root of the definition are the names of Variations.
Variations are frequently directly related to certain modes or actions.

There is a special property name `default` to establish Default settings.
These take precedence whenever an available Variation is not more appropriate.

```json
{
  "default": {
    "name": "my-form"
  },
  "add": {}
}
```

Common Variation names include "add", "edit", "list", etc. Variations can have
any name, and any special behaviour associated with them is the responsibility
of the consumer of the definition.

The `default` property is mandatory, all other Variations are optional.

Unless explicitly specified, we will consider `default` a Variation, and we
include it when we document Variations.

### Contents

Variations contain [Settings](settings.md) and lists of
[Components](components.md).
