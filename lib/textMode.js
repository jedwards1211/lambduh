'use strict'

module.exports = function textMode(fn) {
  process.stdin.resume()
  process.stdin.setEncoding('utf8')

  var inputChunks = []
  process.stdin.on('data', function (chunk) { inputChunks.push(chunk) })

  process.stdin.on('end', function () {
    try {
      process.stdout.write(fn(inputChunks.join()))
    } catch (error) {
      console.error(error.stack) // eslint-disable-line no-console
      process.exit(1)
    }
  })
}

