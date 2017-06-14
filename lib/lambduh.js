/* eslint-env es6 */

const _ = require('lodash') // eslint-disable-line no-unused-vars

const code = process.argv[2].trim()
const fn = eval(code)
if (typeof fn !== 'function') throw new Error('first argument must evaluate to a function')

const match = /[A-Za-z]/.exec(code)
const firstChar = match && match[0].toLowerCase()

if (firstChar === 'l') require('./lineMode')(fn)
else require('./jsonMode')(fn)

