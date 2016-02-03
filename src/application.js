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
 * @param {string} [path] - An optional relative filepath from the current document to a specific appinfo to read
 */
webOS.fetchAppInfo = function(callback, path) {
	if(!webOS.appInfo) {
		parseInfo = function(err, info) {
			if(!err && info) {
				try {
					webOS.appInfo = JSON.parse(info);
					callback && callback(webOS.appInfo);
				} catch(e) {
					console.error("Unable to parse appinfo.json file for " + appID);
					callback && callback();
				}
			} else {
				callback && callback();
			}
		};
		var req = new XMLHttpRequest();
		req.onreadystatechange = function() {
			if(req.readyState==4) {
				if((req.status >= 200 && req.status < 300) || req.status===0) {
					parseInfo(undefined, req.responseText);
				} else {
					parseInfo({status:404});
				}
			}
		};
		try {
			req.open('GET', path || 'appinfo.json', true);
			req.send(null);
		} catch(e) {
			parseInfo({status:404});
		}
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
