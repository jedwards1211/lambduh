'use strict'

module.exports = function linesMode(fn) {
  var lines = []
  require('line-reader').eachLine(process.stdin, function (line) {
    lines.push(line)
  }, function (error) {
    if (error) {
      console.error(error.stack) // eslint-disable-line no-console
      process.exit(1)
      return
    }
    var EOL = require('os').EOL
    var transformed = fn(lines)
    if (transformed instanceof Array) transformed = transformed.join(EOL) + EOL
    process.stdout.write(String(transformed))
  })
}

