#!/usr/bin/env node
/* jshint node: true */
/**
# util.js - webOS.js Build Assistant Util

This portable Node.js script assists in aspects of the build process for
the webOS.js library. Primarily, this script allows for building of a
webOS.js file that can be read and documented in the Enyo API Viewer.

 */

// Load dependencies
var path = require('path'),
	fs = require('fs');

process.on('uncaughtException', function (err) {
	var errMsg = err.toString() + err.stack;
	console.error(errMsg);
	process.exit(1);
});


// Parse arguments

var node = process.argv[0],
	util = process.argv[1],
	src = process.argv[2],
	output = process.argv[3]
	base = path.join(__dirname, "webOSDocBase.js");


// Mainline

fs.readdir(src, function(err, files) {
	if (err) throw err;
	var i1 = files.indexOf("device.js");
	if(i1>-1 && i1!=0) {
		files.splice(i1, 1);
		files.unshift("device.js");
	}
	var i2 = files.indexOf("platform.js");
	if(i2>-1 && i2!=1) {
		files.splice(i2, 1);
		files.splice(1, 0, "platform.js");
	}
	for(var i=0; i<files.length; i++) {
		files[i] = path.join(src, files[i]);
	}
	files.unshift(base);
	processFileChain(files, function() {
		process.exit(0);
	});
});


// Functions

function processFileChain(queue, callback) {
	var file = queue.shift();
	fs.readFile(file, 'utf8', function (err, data) {
		if (err) throw err;
		data = data.replace(/(?:\/\*[^*](?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm, '').replace(/\n\s*\n/g, '\n\n');
		if(file===base) {
			data = data + "\n\n";
		} else {
			data = "// " + path.basename(file) + "\n\n(function(){" + data + "})();\n\n\n";
			//var fName = path.basename(file);
			//data = "(function(){\n\n/** @exports " + fName.charAt(0).toUpperCase() + fName.substring(1, fName.length-3) + " */\n" + data + "})();\n\n\n";
		}
		fs[((file===base) ? "writeFile" : "appendFile")](output, data, function (err) {
  			if (err) throw err;
  			if(queue.length>0) {
				processFileChain(queue, callback)
			} else {
				callback();
			}
  		});
	});
}

