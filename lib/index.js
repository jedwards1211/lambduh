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

var argv = process.argv.slice(2)

function getOption(names) {
  if (!Array.isArray(names)) names = [names]
  for (var i = 0; i < names.length; i++) {
    var index = argv.indexOf(names[i])
    if (index >= 0) {
      var result = argv[index + 1]
      argv.splice(index, 2)
      return result
    }
  }
}

var encoding = getOption('--encoding') || 'utf8'
var eol = getOption('--eol') || require('os').EOL

var mainArgs = argv.filter(function (arg) {
  return !/^-./.test(arg)
})

var hasSubcommand = mainArgs[0] === 'mv'

var fnIndex = hasSubcommand ? 1 : 0
var fnCode = mainArgs[fnIndex]

function performIO(mode) {
  var fn = parseFn(fnCode)
  var files = mainArgs.slice(fnIndex + 1)

  if (files.length) {
    var fs = require('fs')
    var inPlace = argv.indexOf('-i') >= 0

    files.forEach(function (file) {
      var input = file === '-'
        ? process.stdin
        : fs.createReadStream(file, {encoding: encoding, autoClose: true})
      function output() {
        if (file === '-') return process.stdout
        return (inPlace
          ? fs.createWriteStream(file, {defaultEncoding: encoding, autoClose: true})
          : process.stdout
        )
      }
      mode(input, fn, output, {inPlace: inPlace, eol: eol})
    })
  } else {
    mode(process.stdin, fn, function () { return process.stdout }, {inPlace: false, eol: eol})
  }
}

var inputMode = require('./pickInputMode')(process.argv[2], fnCode)

switch (inputMode) {
case 'lines':
  performIO(require('./linesMode'))
  break
case 'line':
  performIO(require('./lineMode'))
  break
case 'text':
  performIO(require('./textMode'))
  break
case 'json':
  performIO(require('./jsonMode'))
  break
case 'mv':
  var fn = parseFn(fnCode)
  require('./mvMode')(fn, argv.slice(1).filter(function (arg) { return arg !== fnCode }))
  break
default:
  console.error('See ' + require('../package.json').repository.url + ' for usage information.') // eslint-disable-line no-console
  process.exit(1)
}

