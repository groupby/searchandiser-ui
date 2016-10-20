#!/usr/bin/env bash

git clone https://github.com/groupby/cdn.git ${HOME}/cdn

currentVersion=$(jq -r .version < package.json)

copyFiles() {
  cp dist/searchandiser-ui-*.js* ${1}
  for file in dist/searchandiser-ui-*.js*
  do
    filename=$(basename "${file}")
    target="${1}/${filename//${currentVersion}/canary}"

    if [[ ${file} =~ \.min\.js$ ]]; then
      sed "s/searchandiser-ui-${currentVersion}/searchandiser-ui-canary/g" "${file}" > "${target}"
    else
      cp "${file}" "${target}"
    fi
  done
}

copyFiles ${HOME}/cdn/static/javascript

cd ${HOME}/cdn
git add static/javascript/searchandiser-ui-*.js*
git commit -m "Release searchandiser-ui v${currentVersion}"
git push
