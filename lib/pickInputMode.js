'use strict'

module.exports = function pickMode(subcommand, code) {
  if (subcommand === 'mv') return 'mv'
  if (!code) return null

  var match = /^\s*(function(\s+\w+)?\s*\(\s*|\(\s*)?(\w+)/.exec(code.toLowerCase())
  var firstArg = match && match[3]

  if (!firstArg) return null

  if (firstArg === 'lines') return 'lines'
  else if (firstArg[0] === 'l') return 'line'
  else if (firstArg[0] === 't') return 'text'
  else return 'json'
}

