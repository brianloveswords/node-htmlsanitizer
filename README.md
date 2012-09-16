# node-htmlsanitizer
A simple wrapper for calling httpsanitzer.org (which itself is a wrapper for calling `bleach.clean` from the python bleach library)


# Usage
Install with `npm install htmlsanitizer`

## Default options

```js
{
  text: null,
  tags: [
    'a',
    'abbr',
    'acronym',
    'b',
    'blockquote',
    'code',
    'em',
    'i',
    'li',
    'ol',
    'strong',
    'ul',
  ],
  attributes: {
    a: ['href', 'title'],
    abbr: ['title'],
    acronym: ['title'],
  },
  styles: [],
  strip: false,
  stripComments: true  
}
```

```js
sanitize(String, callback) // use the defaults
sanitize(Object, callback) // override some or all of the defaults
```

`callback` has the classic signature `function (error, safehtml)`
