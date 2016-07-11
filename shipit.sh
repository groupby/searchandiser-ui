git clone https://github.com/groupby/cdn.git ${HOME}/cdn
git clone -b gh-pages https://github.com/groupby/api-javascript.git ${HOME}/api-javascript

currentVersion=`cat package.json | jq -r .version`

cp dist/searchandiser-ui-*.js ${HOME}/cdn/static/javascript
cp dist/searchandiser-ui-*.js ${HOME}/api-javascript/dist

cd ${HOME}/cdn
git add static/javascript/searchandiser-ui-*.js
git commit -m "Release searchandiser-ui v${currentVersion}"
git push

cd ${HOME}/api-javascript
git add dist/searchandiser-ui-*.js
git commit -m "Release searchandiser-ui v${currentVersion}"
git push
