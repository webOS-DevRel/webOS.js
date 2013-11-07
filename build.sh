#!/bin/bash

WEBOSJS="$(cd `dirname "$0"`; pwd)"
SRC="$WEBOSJS/src"
OUTPUT="$WEBOSJS/webOS.js"
STATUS=0

# functions
writeFile() {
	# Parameters: srcFilepath, srcFilename
	if [ $STATUS -eq 0 ] ; then
		echo "// $2" >> "$OUTPUT"	
		node "$WEBOSJS/node_modules/uglify-js/bin/uglifyjs" "$1" -e -v >> "$OUTPUT" 2>&1
		RET=$?
		if [ $RET -ne 0 ] ; then
			echo " "
			echo "** Error processing $2 **"
			STATUS=$RET
		fi
	fi
}

# mainline

if command -v node >/dev/null 2>&1; then
	echo "Building webOS.js..."
	echo "window.webOS = window.webOS || {};" > "$OUTPUT"
	echo " " >> "$OUTPUT"
	
	# device.js and platform.js have priority, so process them before the other files
	if [ -f "$SRC/device.js" ] ; then
		writeFile "$SRC/device.js" device.js
	fi
	if [ -f "$SRC/platform.js" ] ; then
		writeFile "$SRC/platform.js" platform.js
	fi
	
	# Process all the rest of the javascript files in the src directory
	for f in "$SRC"/*.js ;	do
		if [ "$f" != "$SRC/device.js" ] ; then
			if [ "$f" != "$SRC/platform.js" ] ; then
				writeFile "$f" "$(basename "$f")"
			fi
		fi
	done
	
	if [ $STATUS -eq 0 ] ; then
		echo "Successfully built to $OUTPUT"
	fi
	exit $STATUS
else
	echo "No node found in path"
	exit 1
fi
