'use strict'

module.exports = function mvMode(fn) {
  var files = process.argv.slice(3, process.argv.length - 1).filter(function (file) {
    return !file.startsWith('-')
  })

  if (process.argv.indexOf('-') > 0 || !files.length) {
    require('line-reader').eachLine(
      process.stdin,
      function (file) {
        files.push(file)
      },
      function done(error) {
        if (error) {
          console.error(error.stack) // eslint-disable-line no-console
          process.exit(1)
        }
        ready()
      }
    )
  } else ready()

  function ready() {
    run(files, fn, {
      dryRun: process.argv.indexOf('--dry-run') >= 0,
      noConfirm: process.argv.indexOf('-y') >= 0,
    })
  }

  function run(files, fn, options) {
    var dryRun = options.dryRun
    var noConfirm = options.noConfirm
    var silent = options.silent

    var fs = require('fs')

    files.forEach(function (oldPath) {
      try {
        var newPath = fn(oldPath)
      } catch (error) {
        console.error(error.stack) // eslint-disable-line no-console
        process.exit(1)
      }
      if (newPath === oldPath) return
      if (!silent) console[dryRun ? 'log' : 'error'](oldPath + ' -> ' + newPath) // eslint-disable-line no-console
      if (!dryRun && noConfirm) fs.renameSync(oldPath, newPath)
    })

    if (!dryRun && !noConfirm) {
      var rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
      })

      rl.question('Apply renaming? (y/N)', function (answer) {
        rl.close()
        if (answer && answer[0].toLowerCase() === 'y') {
          run(files, fn, {noConfirm: true, silent: true})
        }
      })
    }
  }
}

