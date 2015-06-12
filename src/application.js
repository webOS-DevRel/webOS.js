/*
 * Copyright (c) 2013-2015 LG Electronics
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

/**
 * @lends webOS
 */

/**
 * Fetches the appID of the caller app
 * @returns {string} AppID of the app.
 */
webOS.fetchAppId = function() {
	if (window.PalmSystem && PalmSystem.identifier) {
		// PalmSystem.identifier: <appid> <processid>
		return PalmSystem.identifier.split(" ")[0];
	}
};

/**
 * @callback webOS~appInfoCallback
 * @param {?object} info - JSON data object read from the app's "appinfo.json" file. Undefined if not found.
 */

/**
 * Fetches the appinfo.json data of the caller app with a cache saved to webOS.appInfo
 * @param {webOS~appInfoCallback} callback - The function to called upon completion
 * @param {string} [path] - A relative filepath from the current document to a specific appinfo to read
 */
webOS.fetchAppInfo = function(callback, path) {
	if(!webOS.appInfo) {
		var appID = this.fetchAppId();
		// Virtually all apps will be at "appinfo.json", but extras help edge cases
		var paths = [
			this.fetchAppRootPath() + "appinfo.json",
			"appinfo.json",
			"file:///media/cryptofs/apps/usr/palm/applications/" + appID + "/appinfo.json",
			"file:///usr/palm/applications/" + appID + "/appinfo.json"
		];
		var index = paths[1].indexOf(appID);
		if(index>-1) { //Possible relative path fix for multiple language apps with multiple documents
			paths.splice(1, 0, paths[1].substring(0, index) + appID + "/appinfo.json");
		}
		path && paths.unshift(path);

		var checkAppInfo = function(parseInfo) {
			if(paths.length==0) {
				parseInfo({status:404});
			} else {
				var curr = paths.shift();
				var req = new XMLHttpRequest();
				req.onreadystatechange = function() {
					if(req.readyState==4) {
						if((req.status >= 200 && req.status < 300) || req.status===0) {
							parseInfo(undefined, req.responseText);
						} else {
							checkAppInfo(parseInfo);
						}
					}
				};
				req.open('GET', curr, true);
				req.send(null);
			}
		};
		checkAppInfo(function(err, info) {
			if(!err && info) {
				try {
					webOS.appInfo = JSON.parse(info);
					callback && callback(webOS.appInfo);
				} catch(e) {
					console.error("Unable to parse appinfo.json file for " + appID);
					callback && callback();
				}
			} else {
				console.error("Unable to find appinfo.json file for " + appID);
				callback && callback();
			}
		});
	} else {
		callback && callback(webOS.appInfo);
	}
};

/**
 * Fetches the full root URI path of the caller app
 * @returns {string} App's URI path the app is within.
 */
webOS.fetchAppRootPath = function() {
	var base = window.location.href;
	if('baseURI' in window.document) {
		base = window.document.baseURI;
	} else {
		var baseTags = window.document.getElementsByTagName("base");
		if(baseTags.length > 0) {
			base = baseTags[0].href;
		}
	}
	var match = base.match(new RegExp(".*:\/\/[^#]*\/"));
	if(match) {
		return match[0];
	}
	return "";
};
