# Forms: Components: Elements

See [Components](components.md) for more information about individual Element
definitions.


## Elements and Form Variations

See [Definition Structure](definition-structure.md) for more information on
Variations.

On a per-Variation basis, you may reduce the default Elements 

For example:

```json
{
  "default": {
    "_elements": [
      {
        "default": {
          "name": "my-element"
        },
        "add": {
          "label": "My Element"
        }
      }
    ],
  }
}
```
