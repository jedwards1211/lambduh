'use strict'

module.exports = function textMode(input, fn, output) {
  input.resume()
  input.setEncoding('utf8')

  var inputChunks = []
  input.on('data', function (chunk) { inputChunks.push(chunk) })

  input.on('end', function () {
    try {
      output().write(fn(inputChunks.join()))
    } catch (error) {
      console.error(error.stack) // eslint-disable-line no-console
      process.exit(1)
    }
  })
}

