const path = require('path')

const normalizePath = module.exports = (dir) => {
  dir = path.normalize(dir)

  if (dir === '/' || dir === './' || dir === '.') {
    return ''
  }

  if (dir.startsWith('./')) {
    dir = dir.substring(2)
  }

  if (dir.startsWith('/')) {
    dir = dir.substring(1)
  }

  if (dir.endsWith('/')) {
    dir = dir.substring(0, dir.length - 1)
  }

  return dir
}

const test = async () => {
  let pass = true

  const tests = [
    { input: '/', expected: '' },
    { input: '/foo', expected: 'foo' },

    { input: './', expected: '' },
    { input: './foo', expected: 'foo' },
    { input: './foo/', expected: 'foo' },
    { input: './foo/bar', expected: 'foo/bar' },
    { input: './foo/bar/', expected: 'foo/bar' },

    { input: '', expected: '' },
    { input: 'foo', expected: 'foo' },
    { input: 'foo/', expected: 'foo' },
    { input: 'foo/bar', expected: 'foo/bar' },
    { input: 'foo/bar/', expected: 'foo/bar' },
  ]

  for (const { input, expected } of tests) {
    const result = normalizePath(input)
    if (result !== expected) {
      console.error(`error("${input}"): expected "${expected}" but got "${result}"`)
      pass = false
    }
  }

  if (!pass) {
    process.exit(1)
  } else {
    console.log('All tests passed')
  }
}

if (require.main === module) {
  test()
}
