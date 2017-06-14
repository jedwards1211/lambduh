/* eslint-env es6 */

module.exports = function lineMode(fn) {
  let lineNumber = 0
  require('line-reader').eachLine(process.stdin, line => {
    const transformed = fn(line, lineNumber++)
    if (transformed === false) return false
    if (transformed != null) {
      process.stdout.write(transformed)
      process.stdout.write('\n')
    }
  }, error => {
    if (error) {
      console.error(error.stack) // eslint-disable-line no-console
      process.exit(1)
    }
  })
}

