# lambduh

[![Build Status](https://travis-ci.org/jedwards1211/lambduh.svg?branch=master)](https://travis-ci.org/jedwards1211/lambduh)
[![Coverage Status](https://coveralls.io/repos/github/jedwards1211/lambduh/badge.svg?branch=master)](https://coveralls.io/github/jedwards1211/lambduh?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## transform `stdin` with JS lambda instead of using `sed`, `jq`, etc. Duh!

My reaction to `jq`: 🤔 *This is cool, but I love ES6. Isn't pure ES6 good enough?*

I think it is.  No new query languages!  No new syntax to learn!  JS über Alles!
```
> npm install --global lambduh

> curl 'https://api.github.com/repos/stedolan/jq/commits?per_page=2' \
  | duh 'json => json.map(({ commit: { message, committer: { name } } }) => ({ message, name }))'
[
  {
    "message": "Deal with strptime() on OS X and *BSD (fix #1415)\n\nstrptime() on OS X and *BSDs (reputedly) does not set tm_wday and\ntm_yday unless corresponding %U and %j format specifiers were used.\nThat can be... surprising when one parsed year, month, and day anyways.\nGlibc's strptime() conveniently sets tm_wday and tm_yday in those cases,\nbut OS X's does not, ignoring them completely.\n\nThis commit makes jq compute those where possible, though the day of\nweek computation may be wrong for dates before 1900-03-01 or after\n2099-12-31.",
    "name": "Nicolas Williams"
  },
  {
    "message": "Attempt to fix #1415\n\nOS X (and *BSD) strptime() does not set tm_wday nor tm_yday unless\ncorresponding format options are used.  That means we must call timegm()\nto set them.",
    "name": "Nicolas Williams"
  }
]

> duh '(line, index) => index < 2 && line.split(/\s+/g).reverse().join(", ")' < names
Edwards, Andy
Doe, John
```

## Node version note

The syntax that `duh` accepts for your function depends on the version of Node you're running.  If you're running a
really old version, you may not be able to use lambdas, and will have to resort to `function () { return ... }` instead.

## Command

You can use `lambduh` or just `duh`.

## Modes

You may have noticed above that you can apply a transformation to each line of a plain text file.
This is pretty much the only magic built into the `duh` command:
* If the first argument of your function is `lines` (ignoring case), it runs in **lines mode**.
* Otherwise if the first argument of your function starts with `l` or `L`, it runs in **line mode**.
* If the first argument of your function starts with `t` or `T`, it runs in **text mode**.
* Otherwise, it runs in **json mode**.

:star: :+1: **Nice!!** :punch: :sparkles:

### JSON Mode

`JSON.parse`s `stdin`, calls your function on it, writes `JSON.stringify` to `stdout`.  Duh!

### Line Mode

Reads lines from `stdin` one-by-one, calls your function on each with `(text, lineNumber)`, and writes what it returns
to `stdout`, except:

* If your function returns `false`, it quits reading lines.
* If your function returns `null` or `undefined`, it skips to the next line without printing anything.

### Lines Mode

Calls your function with an array of lines from stdin.  If your function returns an array of lines, it writes them
in order to `stdout`.  Otherwise, it calls `String` on it and writes that string to `stdout`.

### Text Mode

Calls your function with the entire text from stdin in a single string, and writes what your function returns to
`stdout`.

## Comes with lodash built in
```
> curl 'https://api.github.com/repos/stedolan/jq/commits?per_page=2' \
  | duh 'json => json.map(c => _.pick(c, "sha", "commit.message"))'
[
  {
    "sha": "c538237f4e4c381d35f1c15497c95f659fd55850",
    "commit": {
      "message": "Deal with strptime() on OS X and *BSD (fix #1415)\n\nstrptime() on OS X and *BSDs (reputedly) does not set tm_wday and\ntm_yday unless corresponding %U and %j format specifiers were used.\nThat can be... surprising when one parsed year, month, and day anyways.\nGlibc's strptime() conveniently sets tm_wday and tm_yday in those cases,\nbut OS X's does not, ignoring them completely.\n\nThis commit makes jq compute those where possible, though the day of\nweek computation may be wrong for dates before 1900-03-01 or after\n2099-12-31."
    }
  },
  {
    "sha": "4a6241be0697bbe4ef420c43689c34af59e50330",
    "commit": {
      "message": "Attempt to fix #1415\n\nOS X (and *BSD) strptime() does not set tm_wday nor tm_yday unless\ncorresponding format options are used.  That means we must call timegm()\nto set them."
    }
  }
]
```

