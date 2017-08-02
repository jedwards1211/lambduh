'use strict'

module.exports = function mvMode(fn, args) {
  var files = args.filter(function (file) {
    return !file.startsWith('-')
  })

  if (args.indexOf('-') > 0 || !files.length) {
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
      dryRun: args.indexOf('--dry-run') >= 0,
      noConfirm: args.indexOf('-y') >= 0,
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

