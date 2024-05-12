<!-- markdownlint-disable MD041 MD033 -->
# `kilianc/go-coverage-action`

A GitHub Action to track code coverage in your pull requests, with a beautiful HTML preview, for free.

## How it works

This GHA expects two files to be present in the root of your repo at runtime:

- `cover.txt` is the output of `go tool cover -func=cover.out -o cover.txt`
- `cover.html` is the output of `go tool cover -html=cover.out -o cover.html`

Both `go tool cover` commands can be configured to your liking. For examples on how you might do that you can peak at [`Makefile`](go-test-app/Makefile), or some of my other go projects like [`pretender`](https://github.com/kilianc/pretender/blob/main/Makefile#L44-L57) and [`base-go-cli`](https://github.com/kilianc/base-golang-cli/blob/main/Makefile#L76-L92).

Once the files are generated, the GHA does the following:

1. Create and push new orphan branch if one doesn't exist.
1. Customize `cover.html` with [`nord.css`](assets/nord.css) and rename it `<sha>.html`.
1. `git-push` the `<sha>.html` file to the orphan branch. This will trigger a `GitHub Pages` deployment.
1. Post a comment to your PR with your code coverage summary (`cover.txt`) and a link to your `<sha>.html`.

### Screenshots

<br>
<img width="912" alt="PR Comment" src="https://github.com/kilianc/go-coverage-action/assets/385716/99b01c85-f573-44cb-b554-64e9495aa7d1">
<img width="822" alt="HTML Preview" src="https://github.com/kilianc/go-coverage-action/assets/385716/bb4361f3-34db-4c9d-9970-794d3dded7b9">

## Usage

To use this action simply add it to your pre-existent ci workflow. A bare minimal example might look like this:

```yaml
name: Go

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  test:
    name: Build and Test
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write        # required for posting comments
      contents: write             # required for git push
    steps:
      - uses: actions/checkout@v4

      - name: Set up Go
        uses: actions/setup-go@v5

      - name: Test                # this should generate cover.<txt|html>
        run: make test

      - name: Go Coverage
        uses: 'kilianc/go-coverage-action@main'
```

> [!NOTE]
> In order for the HTML preview links to work, configure `GitHub Pages` in your target repo *(`Settings > Pages`)* to `Deploy from a branch` and pick your target branch, which is, by default, `cover`.
>
> ![GitHub Pages Setup](https://github.com/kilianc/go-coverage-action/assets/385716/a14f4df6-6263-4ae3-8685-e7901a1dbbe2)

## Reference

```yaml
- name: Go Coverage
  uses: 'kilianc/go-coverage-action@main'
  with:
    # Repository name with owner. For example, actions/checkout.
    # Default: ${{ github.repository }}
    repository: ''

    # The branch to checkout or create and push coverage to.
    # Defalut: 'cover'
    branch: ''

    # The token to use for pushing to the repository.
    # Default: ${{ github.token }}
    token: ''
```

## Examples

**You can customize the name of the branch that hosts the code coverage files.**

```yaml
- name: Go Coverage
  uses: 'kilianc/go-coverage-action@main'
  with:
    branch: 'my-coverage'
```

Just make sure to update the `GitHub Pages` deployment settings to match.

**You can customize the repository that hosts the code coverage files.**

This is helpful if you don't want to clutter your project's repo, or if you want to centralize coverage reporting across multiple repos, or you can't turn on `GitHub Pages` in your project's repo.

```yaml
- name: Go Coverage
  uses: 'kilianc/go-coverage-action@main'
  with:
    repository: yourname/coverage
    token: ${{ secrets.GHA_COVERAGE_TOKEN }}
```

Where `GHA_COVERAGE_TOKEN` is a repository secret with a personal token that has write access to `yourname/coverage`.

## License

MIT License, see [LICENSE](./LICENSE.md)
