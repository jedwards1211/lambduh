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
    process.stdout.write(fn(lines).join(EOL))
    process.stdout.write(EOL)
  })
}

