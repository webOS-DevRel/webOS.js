cd webOS.js
npm install .
gulp docs
mv docs/* ..
rm -fr docs
rm -fr node_modules
cd ..
cp webOS.html index.html