'use strict'

var ancestorDirs = []
var dir = process.cwd()
var path = require('path')
var fs = require('fs')
var homedir = require('os').homedir()

while (dir) {
  ancestorDirs.push(dir)
  var parent = path.dirname(dir)
  if (parent === dir) break
  dir = parent
}
if (ancestorDirs.indexOf(homedir) < 0) ancestorDirs.push(homedir)
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

