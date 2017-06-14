#!/usr/bin/env node

'use strict'

var _ = require('lodash') // eslint-disable-line no-unused-vars

var code = process.argv[2].trim()
var fn = eval(code)
if (typeof fn !== 'function') throw new Error('first argument must evaluate to a function')

var match = /[A-Za-z]/.exec(code)
var firstChar = match && match[0].toLowerCase()

if (firstChar === 'l') {
  var linesMatch = /lines/i.exec(code)
  if (linesMatch && linesMatch.index === match.index) require('./linesMode')(fn)
  else require('./lineMode')(fn)
}
else if (firstChar === 't') require('./textMode')(fn)
else require('./jsonMode')(fn)

