#!/bin/bash

set -eo pipefail

# generate coverage files
cd "${INPUTS_PATH}"
go tool cover -html=cover.out -o "${GITHUB_WORKSPACE}/go-cover/${REVISION}.html"
go tool cover -func=cover.out -o "${GITHUB_WORKSPACE}/go-cover/${REVISION}.txt"
cp cover.out                     "${GITHUB_WORKSPACE}/go-cover/${REVISION}.out"

# if we are on the main branch, copy files to main.*
if [ "${REF_NAME}" = "main" ]; then
  cp "${GITHUB_WORKSPACE}/go-cover/${REVISION}.html" "${GITHUB_WORKSPACE}/go-cover/main.html"
  cp "${GITHUB_WORKSPACE}/go-cover/${REVISION}.txt"  "${GITHUB_WORKSPACE}/go-cover/main.txt"
  cp "${GITHUB_WORKSPACE}/go-cover/${REVISION}.out"  "${GITHUB_WORKSPACE}/go-cover/main.out"
fi

cd "${GITHUB_WORKSPACE}/go-cover"

# beautify html
ex -sc '%s/<style>/<style>@import url("nord.css");/'             -c 'x' "${REVISION}.html"
ex -sc '%s/<\/script>/<\/script><script src="ln.js"><\/script>/' -c 'x' "${REVISION}.html"

# copy assets
cp "${GITHUB_ACTION_PATH}"/assets/* .

# push to branch
git add .
git config user.email "go-coverage-action@github.com"
git config user.name "go-coverage-action"

# quick way to continue when there is nothing to commit
# TODO: find a better way to handle this and not mask actual errors
git commit -m "chore: add cover for ${REVISION}" || true

git push origin "${INPUTS_BRANCH}"
