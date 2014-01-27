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
	output = process.argv[2];


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
	fs.writeFile(output, "window.webOS = window.webOS || {};\n\n", function (err) {
		if (err) throw err;
		processFileChain(files, function() {
			process.exit(0);
		});
	});
});


// Functions

function removeLicense(data) {
	var i1 = data.indexOf("/*");
	if(i1>-1) {
		var i2 = data.indexOf("*/", i+2);
		if(i2>-1) {
			var possibleLicense = data.substring(i1, i2+2);
			if(possibleLicense.indexOf("http://www.apache.org/licenses/LICENSE-2.0")>-1) {
				return data.replace(possibleLicense, "");
			} else {
				return data;
			}
		}
	}
}

function processFileChain(queue, callback) {
	var file = queue.shift();
	fs.readFile(file, function (err, data) {
		if (err) throw err;
		data = removeLicense(data);
		data = "// " + path.basename(file) + "\n\n(function(){" + data + "})();\n\n";
		fs.appendFile(output, data, function (err) {
  			if (err) throw err;
  			if(queue.length>0) {
				processFileChain(queue, callback)
			} else {
				callback();
			}
  		});
	});
}

