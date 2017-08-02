'use strict'

module.exports = function jsonMode(input, fn, output) {
  input.resume()
  input.setEncoding('utf8')

  var inputChunks = []
  input.on('data', function (chunk) { inputChunks.push(chunk) })

  input.on('end', function () {
    try {
      output().write(
        JSON.stringify(fn(JSON.parse(inputChunks.join(''))), null, 2)
      )
    } catch (error) {
      console.error(error.stack) // eslint-disable-line no-console
      process.exit(1)
    }
  })
}

