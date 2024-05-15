const fs = require('fs')
const normalizePath = require('./normalize-path')

const checkThreshold = module.exports = async ({ threshold, path, revision }) => {
  path = normalizePath(path)

  const coverageText = fs.readFileSync(`go-cover/${path}/revisions/${revision}.txt`, 'utf8').split('\n').slice(0, -1)
  const coverageTextSummary = coverageText[coverageText.length-1].split('\t').pop()

  const coverage = parseFloat(coverageTextSummary.replace('%', ''), 10)

  if (coverage < threshold) {
    console.log(`\x1b[91m✘ coverage ${coverage}% < ${threshold}%`)
    process.exit(1)
  }

  console.log(`\x1b[92m✔ coverage ${coverage}% >= ${threshold}%`)
}
