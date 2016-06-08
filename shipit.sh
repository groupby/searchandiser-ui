#!/usr/bin/env bash
# This script creates a release of the Searchandiser UI and makes it available on the groupby CDN.

# read version number from standard in.
currentBranch=`git name-rev --name-only HEAD`
currentVersion=`cat package.json | jq -r .version`
echo "Type the version number that you want to use (Current version is: ${currentVersion})"
read newVersion
if [[ ! "${newVersion}" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Version number must be of the form x.x.x"
  exit 1
fi

# retag package json.
perl -pi -e "s,\"version\":\s*\"${currentVersion}\",\"version\": \"${newVersion}\",g" package.json
perl -pi -e "s,-${currentVersion},-${newVersion},g" README.md

git add package.json README.md
git commit -m "bumped version from ${currentVersion} --> ${newVersion}" || exit 1
git push || exit 1

# # build distribution.
# gulp build
# echo "Built new versions in dist"
# ls dist

# # checkout gh-pages
# git checkout gh-pages || exit 1
# git add dist || exit 1
# git commit -m "built and deployed version: ${newVersion}" || exit 1
# git push || exit 1
#
# echo "Going back to original branch: ${currentBranch}"
# git checkout ${currentBranch}
