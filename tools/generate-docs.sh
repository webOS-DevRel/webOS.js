#!/bin/bash

TOOLS="$(cd `dirname "$0"`; pwd)"
WEBOSJS="`dirname "$TOOLS"`"

# mainline

if command -v node >/dev/null 2>&1; then
	if [ ! -f "$WEBOSJS/node_modules/jsdoc/jsdoc.js" ]  ; then
		echo "Installing prerequisite JSDoc..."
		if [ ! -e "$WEBOSJS/node_modules" ] ; then
			mkdir -p "$WEBOSJS/node_modules"
		fi
		npm install jsdoc --prefix "$WEBOSJS/node_modules"
		
		echo " "
	fi
	if [ ! -f "$WEBOSJS/tools/util/docs-template/publish.js" ]  ; then
		cp -fr "$WEBOSJS/node_modules/jsdoc/templates/default/"* "$WEBOSJS/tools/util/docs-template/"
		cp -f "$WEBOSJS/tools/util/docs-template/custom-publish.js" "$WEBOSJS/tools/util/docs-template/publish.js"
		cp -f "$WEBOSJS/node_modules/jsdoc/LICENSE.md" "$WEBOSJS/tools/util/docs-template/LICENSE.md"
	fi
	
	rm -fr "$WEBOSJS/docs"
	mkdir -p "$WEBOSJS/docs"	
	
	echo "Generating webOS.js Documentation..."
	node "$WEBOSJS/tools/util/jsdoc-build.js" "$WEBOSJS/src" "$WEBOSJS/docs/webOS.js"
	node "$WEBOSJS/node_modules/jsdoc/jsdoc.js" "$WEBOSJS/docs/webOS.js" -d "$WEBOSJS/docs" -t "$WEBOSJS/tools/util/docs-template/"
	if [ $? -eq 0 ] ; then
		echo "Successfully built to $WEBOSJS/docs"
		cp -f "$WEBOSJS/tools/util/docs-template/index.html" "$WEBOSJS/docs/index.html"
	fi
	rm -f "$WEBOSJS/docs/webOS.js"
else
	echo "No node found in path"
	exit 1
fi
