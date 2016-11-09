rm -rf dist
rm -f package.log

touch package.log 2> /dev/null

# -- TYPESCRIPT FILES --
echo '== processing typescript files' | tee -a package.log

# compile typescript files
npm run 'ts:build' >> package.log

# -- RIOT TAGS --
echo '== processing riot tags files' | tee -a package.log

# compile riot tags to es6
echo ' |-- compiling riot tags to es6' | tee -a package.log
npm run 'riot:build' >> package.log

# transpile es6 tags to es5
echo ' |-- transpiling riot tags to es5' | tee -a package.log
npm run 'riot:babel' >> package.log

# remove references to .tag.html files
echo ' |-- updating require statements for tag files' | tee -a package.log
sed -i.bak 's/\.tag\.html/\.tag/g' dist/src/tags/**/*.tag.js dist/src/tags/index{.d.ts,.js}

# add riot to tag files
echo ' `-- adding riot import to tag files' | tee -a package.log
sed -i.bak $'2s/^/var riot = require("riot");\\\n/' dist/src/tags/**/*.tag.js
# sed -i.bak '1i' dist/src/tags/**/*.tag.js

echo '== processing images' | tee -a package.log
# copy images
rsync -Rv src/tags/**/*.png dist

images=dist/src/tags/**/*.png
for i in $images; do
  echo "data:$(file -bi "$i");base64,$(base64 "$i")" > ${i%.*}.datauri
done
sed -i.bak "s/\.png/\.datauri/g" dist/src/tags/**/*.js

rm -rf dist/src/tags/**/*.png dist/src/tags/**/*.bak dist/src/tags/*.bak
