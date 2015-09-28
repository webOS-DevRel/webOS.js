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
 * @namespace webOS.deviceInfo
 */

/**
  * @callback webOS~deviceCallback
  * @param {object} info - JSON object containing the device information details
  * @param {string} info.modelName Model name of device in UTF-8 format
  * @param {string} info.modelNameAscii Model name of device in ASCII format
  * @param {string} info.version Full OS firmware version string
  * @param {number} info.versionMajor Subset of OS version string: Major version number
  * @param {number} info.versionMinor Subset of OS version string: Minor version number
  * @param {number} info.versionDot Subset of OS version string: Dot version number
  * @param {string} info.sdkVersion webOS SDK version
  * @param {number} info.screenWidth Width in pixels
  * @param {number} info.screenHeight Height in pixels
  * @param {boolean} [info.uhd] Whether supports Ultra HD resolution.
  */

/**
 * Gets the device-specific information regarding model, OS version, specifications, etc.
 * @param {webOS~deviceCallback} callback - The function to call once the information is collected
 */
webOS.deviceInfo = function(callback) {
	if(!this.device) {
		this.device = {};
		try {
			var deviceInfo = JSON.parse(PalmSystem.deviceInfo);
			this.device.modelName = deviceInfo.modelName;
			this.device.modelNameAscii = deviceInfo.modelNameAscii;
			this.device.version = deviceInfo.platformVersion;
			this.device.versionMajor = deviceInfo.platformVersionMajor;
			this.device.versionMinor = deviceInfo.platformVersionMinor;
			this.device.versionDot = deviceInfo.platformVersionDot;
			this.device.sdkVersion = deviceInfo.platformVersion;
			this.device.screenWidth = deviceInfo.screenWidth;
			this.device.screenHeight = deviceInfo.screenHeight;
		} catch(e) {
			this.device.modelName = this.device.modelNameAscii = "webOS Device";
		}
		this.device.screenHeight = this.device.screenHeight || screen.height;
		this.device.screenWidth = this.device.screenWidth || screen.width;
		var self = this;
		if(webOS.platform.tv) {
			webOS.service.request("luna://com.webos.service.tv.systemproperty", {
				method: "getSystemInfo",
				parameters: { "keys": ["firmwareVersion", "modelName", "sdkVersion", "UHD"] },
				onSuccess: function(response) {
					self.device.modelName = response.modelName || self.device.modelName;
					self.device.modelNameAscii  = response.modelName || self.device.modelNameAscii;
					self.device.sdkVersion  = response.sdkVersion || self.device.sdkVersion;
					self.device.uhd = (response.UHD==='true');
					if(!response.firmwareVersion || response.firmwareVersion==="0.0.0") {
						response.firmwareVersion = response.sdkVersion;
					}
					if(response.firmwareVersion) {
						self.device.version = response.firmwareVersion;
						var segments = self.device.version.split(".");
						var keys = ["versionMajor", "versionMinor", "versionDot"];
						for(var i=0; i<keys.length; i++) {
							try {
								self.device[keys[i]] = parseInt(segments[i]);
							} catch(e) {
								self.device[keys[i]] = segments[i];
							}
						}
					}
					callback(self.device);
				},
				onFailure: function(inError) {
					callback(self.device);
				}
			});
		} else {
		    if(webOS.platform.watch) {
		    	this.device.modelName = this.device.modelNameAscii = "webOS Watch";
		    }
			callback(this.device);
		}
	} else {
		callback(this.device);
	}
};
