var spawn = require('child_process').spawn
var expect = require('chai').expect
var pickInputMode = require('../lib/pickInputMode')

function testCase(input, args, output, done) {
  var child = spawn(process.argv[0], [require.resolve('../lib')].concat(args))
  var outchunks = []
  var errchunks = []
  child.stdout.on('data', function (chunk) { outchunks.push(chunk) })
  child.stderr.on('data', function (chunk) { errchunks.push(chunk) })
  child.on('close', function (code, signal) {
    expect(signal).not.to.exist
    if (output instanceof Error) {
      expect(code).not.to.equal(0)
      expect(errchunks.join('')).to.match(new RegExp(output.message))
    } else {
      expect(errchunks.join('')).to.equal('')
      expect(outchunks.join('')).to.equal(output)
      expect(code).to.equal(0)
    }
    done()
  })

  child.stdin.write(input)
  child.stdin.end()
}

describe('lambduh', function () {
  it("errors if last argument isn't a function", function (done) {
    testCase(
      'input',
      '2881234',
      new Error("invalid function"),
      done
    )
  })
  it("errors if function argument is missing", function (done) {
    testCase(
      'input',
      [],
      new Error('See ' + require('../package.json').repository.url + ' for usage information.'),
      done
    )
  })
  it("errors if function argument is empty", function (done) {
    testCase(
      'input',
      ['mv', ''],
      new Error('missing function'),
      done
    )
  })
  describe('pickInputMode', function () {
    it('works for basic lambda', function () {
      expect(pickInputMode(' lines => lines.reverse()')).to.equal('lines')
      expect(pickInputMode('line => line.toUpperCase()')).to.equal('line')
      expect(pickInputMode('t => t.toUpperCase()')).to.equal('text')
    })
    it('works for lambda with parentheses', function () {
      expect(pickInputMode(' (lines) => lines.reverse()')).to.equal('lines')
      expect(pickInputMode('( line) => line.toUpperCase()')).to.equal('line')
      expect(pickInputMode(' ( t ) => t.toUpperCase()')).to.equal('text')
    })
    it('works for function without name', function () {
      expect(pickInputMode('function (lines) { return lines.reverse() }')).to.equal('lines')
      expect(pickInputMode(' function ( line) { return line.toUpperCase() }')).to.equal('line')
      expect(pickInputMode('function( t ) { return t.toUpperCase() }')).to.equal('text')
      expect(pickInputMode('function(j){ return j.toUpperCase() }')).to.equal('json')
    })
    it('works for function with name', function () {
      expect(pickInputMode('function blah_(lines) { return lines.reverse() }')).to.equal('lines')
      expect(pickInputMode(' function bl_ah ( line) { return line.toUpperCase() }')).to.equal('line')
      expect(pickInputMode('function aksnd923ka_( t ) { return t.toUpperCase() }')).to.equal('text')
      expect(pickInputMode('function blaAARrgh__(j){ return j.toUpperCase() }')).to.equal('json')
    })
    it('works for mv', function () {
      expect(pickInputMode('mv')).to.equal('mv')
    })
    it("returns null if it can't find first argument", function () {
      expect(pickInputMode('(')).to.equal(null)
    })
  })
  describe('jsonMode', function () {
    it('works for valid input', function (done) {
      var input = [{"hash": "892n3kjasdf82", "name": "Andy Edwards"}, {"hash": "8nkkk0238lksd", "name": "John Doe"}]
      testCase(
        JSON.stringify(input),
        'json => json.map(c => c.hash)',
        JSON.stringify(input.map(function (c) { return c.hash }), null, 2),
        done
      )
    })
    it('errors for invalid input', function (done) {
      testCase(
        '[{"hash": "892n3kjasdf82", "name": "Andy Edwards"}, {"hash": "8nkkk0238lksd", "name": "',
        'json => json.map(c => c.hash)',
        new Error("Unexpected end of"),
        done
      )
    })
  })
  describe('lineMode', function () {
    it('works for valid input', function (done) {
      var names = ['Billy Bob', 'Jim Bob', 'Ida Mae', 'Thelma Louise']
      testCase(
        names.join('\n') + '\n',
        'line => line.split(/\\s+/).reverse().join(", ")',
        ['Bob, Billy', 'Bob, Jim', 'Mae, Ida', 'Louise, Thelma'].join('\n') + '\n',
        done
      )
    })
    it('passes index to function', function (done) {
      var lines = ['a', 'b', 'c']
      testCase(
        lines.join('\n') + '\n',
        '(line, index) => index + ": " + line',
        ['0: a', '1: b', '2: c'].join('\n') + '\n',
        done
      )
    })
    it('handles errors in function', function (done) {
      var lines = ['a', 'b', 'c']
      testCase(
        lines.join('\n') + '\n',
        'line => { throw new Error("TEST") }',
        new Error("TEST"),
        done
      )
    })
    it('breaks when function returns false', function (done) {
      var lines = ['a', 'b', 'c']
      testCase(
        lines.join('\n') + '\n',
        '(line, index) => index < 2 ? line : false',
        ['a', 'b'].join('\n') + '\n',
        done
      )
    })
    it("doesn't output null or undefined return values", function (done) {
      var lines = ['a', 'b', 'c']
      testCase(
        lines.join('\n') + '\n',
        '(line, index) => index === 1 ? null : line',
        ['a', 'c'].join('\n') + '\n',
        done
      )
    })
  })
  describe('linesMode', function () {
    it('works for valid input', function (done) {
      var names = ['Billy Bob', 'Jim Bob', 'Ida Mae', 'Thelma Louise']
      testCase(
        names.join('\n') + '\n',
        'lines => lines.reverse()',
        names.reverse().join('\n') + '\n',
        done
      )
    })
    it('works when function returns non-Array', function (done) {
      var names = ['Billy Bob', 'Jim Bob', 'Ida Mae', 'Thelma Louise']
      testCase(
        names.join('\n') + '\n',
        'lines => lines.join("\\t")',
        names.join('\t'),
        done
      )
    })
  })
  describe('textMode', function () {
    it('works for valid input', function (done) {
      var names = ['Billy Bob', 'Jim Bob', 'Ida Mae', 'Thelma Louise']
      testCase(
        names.join('\n') + '\n',
        'text => text.toUpperCase()',
        (names.join('\n') + '\n').toUpperCase(),
        done
      )
    })
    it('handles errors in function', function (done) {
      var lines = ['a', 'b', 'c']
      testCase(
        lines.join('\n') + '\n',
        'text => { throw new Error("TEST") }',
        new Error("TEST"),
        done
      )
    })
  })
  describe('mvMode', function () {
    it('works for valid input', function (done) {
      testCase(
        'foo\nbar\nBAZ',
        ['mv', '--dry-run', 'qux', '-', 'blah blah', 'file => file.toUpperCase()'],
        'qux -> QUX\nblah blah -> BLAH BLAH\nfoo -> FOO\nbar -> BAR\n',
        done
      )
    })
    it('reads from STDIN when no files are given in arguments', function (done) {
      testCase(
        'foo\nbar\nBAZ',
        ['mv', '--dry-run', 'file => file.toUpperCase()'],
        'foo -> FOO\nbar -> BAR\n',
        done
      )
    })
    it("doesn't read from STDIN when file arguments are given", function (done) {
      testCase(
        'qux',
        ['mv', '--dry-run', 'foo', 'bar', 'file => file.toUpperCase()'],
        'foo -> FOO\nbar -> BAR\n',
        done
      )
    })
    it('handles errors in function', function (done) {
      testCase(
        'foo\nbar\nBAZ',
        ['mv', '--dry-run', '-', 'file => { throw new Error("TEST") }'],
        new Error("TEST"),
        done
      )
    })
  })
})

