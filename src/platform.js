/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/**
 * @namespace webOS.platform
 */

if(window.PalmSystem) {
	/**
	 * Platform identification of webOS variants
	 * @readonly
	 * @type {object}
	 * @property {?boolean} tv - Set true for LG webOS TV
	 * @property {?boolean} open - Set true for Open webOS
	 * @property {?boolean} legacy - Set true for legacy webOS 1.x-3.0.4
 	*/
	webOS.platform = {};
	if((navigator.userAgent.indexOf("SmartTV")>-1) || (navigator.userAgent.indexOf("Large Screen")>-1)) {
		webOS.platform.tv = true;
	} else if(webOS.device.platformVersionMajor && webOS.device.platformVersionMinor) {
		try {
			var major = parseInt(webOS.device.platformVersionMajor);
			var minor = parseInt(webOS.device.platformVersionMinor);
			if(major<3 || (major==3 && minor<=0)) {
				webOS.platform.legacy = true;
			} else {
				webOS.platform.open = true;
			}
		} catch(e) {
			webOS.platform.open = true;
		}
	} else {
		webOS.platform.open = true;
	}
}
