#!/bin/bash

if [ "${REVISION}" = "local" ]; then
  set -eo pipefail
else
  set -xeo pipefail
fi

if [ -z "${REVISION}" ]; then
  echo "REVISION is not set"
  exit 1
fi

# this is useful for browser caching
hash=$(cat index.css index.js | md5sum | awk '{print $1}')

for file in "revisions/${REVISION}.html" "revisions/${REVISION}-inc.html"; do
  ex -sc '%s/\n\t\t<style>\_.\{-}<\/style>//' -c 'x' "${file}"
  ex -sc '%s/\n\t<script>\_.\{-}<\/script>//' -c 'x' "${file}"
  ex -sc '%s/<title>/<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" \/>\r\t\t<title>/' -c 'x' "${file}"
  ex -sc '%s/<title>/<meta http-equiv="Pragma" content="no-cache" \/>\r\t\t<title>/' -c 'x' "${file}"
  ex -sc '%s/<title>/<meta http-equiv="Expires" content="0" \/>\r\t\t<title>/' -c 'x' "${file}"
  ex -sc '%s/<\/title>/<\/title>\r\t\t<script src="..\/index.js?'"${hash}"'"><\/script>/' -c 'x' "${file}"
done
