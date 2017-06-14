/* eslint-env es6 */

module.exports = function jsonMode(fn) {
  const {stdin, stdout} = process
  stdin.resume()
  stdin.setEncoding('utf8')

  const inputChunks = []
  stdin.on('data', chunk => inputChunks.push(chunk))

  stdin.on('end', () => {
    try {
      stdout.write(
        JSON.stringify(fn(JSON.parse(inputChunks.join())), null, 2)
      )
    } catch (error) {
      console.error(error.stack) // eslint-disable-line no-console
      process.exit(1)
    }
  })
}

