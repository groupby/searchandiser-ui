#!/usr/bin/env bash

rm -rf dist
rm -f package.log

touch package.log 2> /dev/null

# -- TYPESCRIPT FILES --
echo '== processing typescript files' | tee -a package.log

# compile typescript files
echo ' `-- transpiling ts files' | tee -a package.log
npm run 'ts:build' >> package.log

# -- RIOT TAGS --
echo '== processing riot tags files' | tee -a package.log

# compile riot tags to es5
echo ' |-- compiling tags to es5' | tee -a package.log
npm run 'riot:build' >> package.log

# remove references to .tag.html files
echo ' |-- updating require statements for tags' | tee -a package.log
sed -i.bak 's/\.tag\.html/\.tag/g' dist/src/tags/**/index{.d.ts,.js}
sed -i.bak 's/\.png/\.datauri/g' dist/src/tags/**/*.js

# add riot to tag files
echo ' `-- adding riot import to tags' | tee -a package.log
for i in dist/src/tags/**/*.tag.js; do
  sed -i.bak $'1s/^/var riot = require("riot");\\\n/' $i
done

# -- IMAGES --
echo '== processing images' | tee -a package.log

# copy images
echo ' |-- copying images' | tee -a package.log
rsync -Rv src/tags/**/*.png dist >> package.log

echo ' `-- converting images to data uris' | tee -a package.log
for i in dist/src/tags/**/*.png; do
  echo "data:$(file -bi "$i");base64,$(base64 "$i")" > ${i%.*}.datauri
done

echo '== cleaning up ==' | tee -a package.log
rm -rf dist/src/tags/**/*.png dist/src/tags/**/*.bak dist/src/tags/*.bak
