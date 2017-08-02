'use strict'

module.exports = function lineMode(input, fn, makeOutput, options) {
  var lineNumber = 0
  var transformedLines = []
  var inPlace = options.inPlace
  var EOL = options.eol
  var output = inPlace ? null : makeOutput()
  require('line-reader').eachLine(input, function (line) {
    try {
      var transformed = fn(line, lineNumber++)
    } catch (error) {
      console.error(error.stack) // eslint-disable-line no-console
      process.exit(1)
    }
    if (transformed === false) return false
    if (transformed != null) {
      if (inPlace) {
        transformedLines.push(transformed)
      } else {
        output.write(transformed)
        output.write(EOL)
      }
    }
  }, function (error) {
    if (error) {
      console.error(error.stack) // eslint-disable-line no-console
      process.exit(1)
    } else if (inPlace) {
      makeOutput().write(transformedLines.join(EOL) + EOL)
    }
  })
}

