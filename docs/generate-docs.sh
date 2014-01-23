#!/bin/bash

DOCS="$(cd `dirname "$0"`; pwd)"
WEBOSJS=`dirname "$DOCS"`

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
	
	
	echo "Generating webOS.js Documentation..."
	
	#node "$WEBOSJS/node_modules/uglify-js/bin/uglifyjs" 
	#if [ $? -eq 0 ] ; then
	#	echo "Successfully built to $OUTPUT"
	#fi
else
	echo "No node found in path"
	exit 1
fi
