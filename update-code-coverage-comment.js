const fs = require('fs')

const updateCodeCoverageComment = module.exports = async ({ context, github }, revision) => {
  const comments = await github.rest.issues.listComments({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
    per_page: 100
  })

  const coverageComment = comments.data.find((comment) => {
    return comment.body.startsWith('<!-- coverage -->')
  }) || {}

  const commentBody = [
    '<!-- coverage -->',
    `### [Code Coverage Report 🔗](https://${context.repo.owner}.github.io/${context.repo.repo}/${revision}.html#file0) for ${revision}`,
  ]

  if (fs.existsSync('cover.txt') === true) {
    const coverageText = fs.readFileSync('cover.txt', 'utf8').split('\n').slice(0, -1)
    const coverageTextSummary = coverageText[coverageText.length-1].split('\t').pop()

    commentBody.push(
      '```',
      `Total: ${coverageTextSummary}`,
      '```',
      '<details>',
      '<summary>Full coverage report</summary>',
      '',
      '```',
      ...coverageText,
      '```',
      '</details>',
    )
  }

  const upsertCommentOptions = {
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
    comment_id: coverageComment.id,
    body: commentBody.join('\n')
  }

  if (coverageComment.id) {
    await github.rest.issues.updateComment(upsertCommentOptions)
  } else {
    await github.rest.issues.createComment(upsertCommentOptions)
  }
}
