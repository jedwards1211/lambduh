'use strict'

var ancestorDirs = []
var dir = process.cwd()
var path = require('path')
var fs = require('fs')
var homedir = require('os').homedir()
var root = path.resolve(__dirname, '..')

while (dir) {
  ancestorDirs.push(dir)
  var parent = path.dirname(dir)
  if (parent === dir) break
  // istanbul ignore next
  if (process.env.BABEL_ENV === 'test' && root.startsWith(dir)) break
  dir = parent
}
if (process.env.BABEL_ENV !== 'test' && ancestorDirs.indexOf(homedir) < 0) {
  ancestorDirs.push(homedir)
}
ancestorDirs.reverse()

ancestorDirs.forEach(function (dir) {
  var rcFile = path.join(dir, '.lambduh.js')
  try {
    fs.statSync(rcFile)
  } catch (error) {
    return
  }
  try {
    require(rcFile)
  } catch (error) {
    console.error('error loading ' + rcFile) // eslint-disable-line no-console
    console.error(error.stack) // eslint-disable-line no-console
    process.exit(1)
  }
})

