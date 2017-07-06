#!/usr/bin/env node

'use strict'

require('./loadRcFiles')

function parseFn(code) {
  if (!code || !code.trim()) {
    console.error('Error: missing function argument')  // eslint-disable-line no-console
    process.exit(1)
  }

  var fn
  try {
    fn = eval(code)
  } catch (error) {
    // ignore
  }
  if (typeof fn !== 'function') {
    console.error('Error: invalid function: ' + code) // eslint-disable-line no-console
    process.exit(1)
  }
  return fn
}

switch (require('./pickInputMode')(process.argv[2])) {
case 'lines':
  require('./linesMode')(parseFn(process.argv[2]))
  break
case 'line':
  require('./lineMode')(parseFn(process.argv[2]))
  break
case 'text':
  require('./textMode')(parseFn(process.argv[2]))
  break
case 'json':
  require('./jsonMode')(parseFn(process.argv[2]))
  break
case 'mv':
  require('./mvMode')(parseFn(process.argv[Math.max(3, process.argv.length - 1)]))
  break
default:
  console.error('See ' + require('../package.json').repository.url + ' for usage information.') // eslint-disable-line no-console
  process.exit(1)
}

