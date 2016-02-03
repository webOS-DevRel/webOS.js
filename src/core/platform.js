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
 * @namespace webOS.platform
 */

/**
 * Platform identification of webOS variants
 * @readonly
 * @type {object}
 * @property {?boolean} tv - Set true for LG webOS SmartTV
 * @property {?boolean} watch - Set true for LG webOS SmartWatch
 * @property {?boolean} open - Set true for Open webOS
 * @property {?boolean} legacy - Set true for legacy webOS (Palm and HP hardware)
 * @property {?boolean} unknown - Set true for any unknown system
*/
webOS.platform = {};
if(window.PalmSystem) {
	if(navigator.userAgent.indexOf("SmartWatch")>-1) {
		webOS.platform.watch = true;
	} else if((navigator.userAgent.indexOf("SmartTV")>-1) || (navigator.userAgent.indexOf("Large Screen")>-1)) {
		webOS.platform.tv = true;
	} else {
		try {
			var legacyInfo = JSON.parse(PalmSystem.deviceInfo || "{}");
			if(legacyInfo.platformVersionMajor && legacyInfo.platformVersionMinor) {
				var major = parseInt(legacyInfo.platformVersionMajor);
				var minor = parseInt(legacyInfo.platformVersionMinor);
				if(major<3 || (major==3 && minor<=0)) {
					webOS.platform.legacy = true;
				} else {
					webOS.platform.open = true;
				}
			}
		} catch(e) {
			webOS.platform.open = true;
		}
		window.Mojo = window.Mojo || {relaunch: function(e) {}};
		window.PalmSystem && PalmSystem.stageReady && PalmSystem.stageReady();
	}
} else {
	webOS.platform.unknown = true;
}
