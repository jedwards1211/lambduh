#!/usr/bin/env node

'use strict'

var _ = require('lodash') // eslint-disable-line no-unused-vars

var code = process.argv[2].trim()
var fn = eval(code)
if (typeof fn !== 'function') {
  process.stderr.write('Error: first argument must evaluate to a function\n')
  process.exit(1)
}

switch (require('./pickInputMode')(code)) {
case 'lines':
  require('./linesMode')(fn)
  break
case 'line':
  require('./lineMode')(fn)
  break
case 'text':
  require('./textMode')(fn)
  break
case 'json':
  require('./jsonMode')(fn)
  break
default:
  process.stderr.write("Error: Can't determine input mode!")
  process.exit(1)
}

