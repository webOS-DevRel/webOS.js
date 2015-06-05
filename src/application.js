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
 * Fetches the appinfo.json data of the caller app
 * @returns {object} JSON data object read from the app's "appinfo.json" file.
 */
webOS.fetchAppInfo = function() {
	if(!this.appInfo) {
		var readAppInfoFile = function(filepath) {
			if(window.palmGetResource) {
				try {
					return palmGetResource(filepath);
				} catch(e) {
					console.log("error reading appinfo.json" + e.message);
				}
			} else {
				var req = new XMLHttpRequest();
				req.open('GET', filepath + "?palmGetResource=true", false);
				req.send(null);
				if(req.status >= 200 && req.status < 300) {
					return req.responseText;
				} else {
					console.log("error reading appinfo.json");
				}
			}
		};
		var appID = this.fetchAppId();
		var paths = [
			this.fetchAppRootPath() + "appinfo.json",
			"file:///media/cryptofs/apps/usr/palm/applications/" + appID + "/appinfo.json",
			"file:///usr/palm/applications/" + appID + "/appinfo.json"
		]; //possible appinfo paths to check
		var index = paths[0].indexOf(appID);
		if(index>-1) {
			paths.unshift(paths[0].substring(0, index) + appID + "/appinfo.json");
		}
		var appInfoJSON = undefined;
		for(var i=0; i<paths.length && !appInfoJSON; i++) {
			appInfoJSON = readAppInfoFile(paths[i]);
		}
		if(appInfoJSON) {
			try {
				this.appInfo = JSON.parse(appInfoJSON);
			} catch(e) {
				console.error("Unable to parse appinfo.json file for " + appID);
			}
		}
	}
	return this.appInfo;
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
