'use strict'

module.exports = function linesMode(input, fn, output, options) {
  var lines = []
  var EOL = options.eol
  require('line-reader').eachLine(input, function (line) {
    lines.push(line)
  }, function (error) {
    if (error) {
      console.error(error.stack) // eslint-disable-line no-console
      process.exit(1)
      return
    }
    var transformed = fn(lines)
    if (transformed instanceof Array) transformed = transformed.join(EOL) + EOL
    output().write(String(transformed))
  })
}

