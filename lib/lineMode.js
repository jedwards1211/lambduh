'use strict'

module.exports = function lineMode(fn) {
  var lineNumber = 0
  require('line-reader').eachLine(process.stdin, function (line) {
    try {
      var transformed = fn(line, lineNumber++)
    } catch (error) {
      console.error(error.stack) // eslint-disable-line no-console
      process.exit(1)
    }
    if (transformed === false) return false
    if (transformed != null) {
      process.stdout.write(transformed)
      process.stdout.write('\n')
    }
  }, function (error) {
    if (error) {
      console.error(error.stack) // eslint-disable-line no-console
      process.exit(1)
    }
  })
}

