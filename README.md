# Mephisto

Return a request handler from an API schema.

## Install

```sh
$ git clone https://github.com/jclem/mephisto
$ cd mephisto
$ npm install
```

## Use

```javascript
var mephisto = require('mephisto'),
    http     = require('http'),
    schema   = require('./schema'),
    handler  = mephisto(schema);

http.createServer(handler);
```
