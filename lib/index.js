#!/usr/bin/env node

'use strict'

require('./loadRcFiles')

if (!process.argv[2]) {
  console.error('Error: first argument must evaluate to a function') // eslint-disable-line no-console
  process.exit(1)
}

var fn = eval(process.argv[2].trim())
if (typeof fn !== 'function') {
  console.error('Error: first argument must evaluate to a function') // eslint-disable-line no-console
  process.exit(1)
}

switch (require('./pickInputMode')(process.argv[2].trim())) {
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

