cd webOS.js
npm install .
gulp docs
cp -fr docs/* ..
rm -fr docs
rm -fr node_modules
cd ..
sed -e 's/        webOS//' -e 's/Namespace: webOS/<img src="logo.png" style="margin: 0 0 -40px -20px;"\/>/' -e 's/<h3 class="subsection-title">Namespaces<\/h3>/<h1 style="margin-left:-10px">window.webOS<\/h1><h3 class="subsection-title">Namespaces<\/h3>/'  webOS.html > index.html
