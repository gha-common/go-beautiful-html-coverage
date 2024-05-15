#!/bin/bash

set -eo pipefail

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
fi
