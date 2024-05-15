#!/bin/bash

set -xeo pipefail

cd go-cover
git fetch origin

# if branch exists, pull it, otherwise create it
if git rev-parse --verify "origin/${INPUTS_BRANCH}"; then
  git checkout "${INPUTS_BRANCH}"
  git pull origin "${INPUTS_BRANCH}"
else
  git checkout --orphan "${INPUTS_BRANCH}"
  rm .git/index
  git clean -fdx
  mkdir -p "./${INPUTS_PATH}/head"
  touch "./${INPUTS_PATH}/head/head.html"
  touch "./${INPUTS_PATH}/head/head.txt"
  echo "mode: set" > "./${INPUTS_PATH}/head/head.out"
fi
