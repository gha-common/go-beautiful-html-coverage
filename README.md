# go-coverage-action

This GitHub Action posts a comment in your pull requests, with a summary of your code coverage and a link to a HTML preview. It expects a cover.html to be generated in the root of your repository, using `go tool cover -html=cover.out -o cover.html` (see [Makefile](./Makefile) for examples).

![](https://github.com/kilianc/go-coverage-action/assets/385716/bb4361f3-34db-4c9d-9970-794d3dded7b9)

![](https://github.com/kilianc/go-coverage-action/assets/385716/db3512e5-acbb-441e-9f5e-2ed5f8c6a65c)

## Usage



## Examples

```yaml
name: CI

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write # required for posting comments
      contents: write      # required for git push
    steps:
      - uses: actions/checkout@v4          #
                                           #
      - name: Set up Go                    #
        uses: actions/setup-go@v5          #
        with:                              #
          go-version: '1.22'               # this is your ci pipelines
                                           #
      - name: Generate Coverage Files      #
        run: |                             #
          make cover.txt                   #
          make cover.html                  #

      - name: Upload Coverage
        uses: 'kilianc/go-coverage-action@main'
        with:
          branch: 'cover'
```
