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
 * @namespace webOS.device
 */

try {
	var deviceInfo = JSON.parse(PalmSystem.deviceInfo);
	
	/**
	 * Detailed webOS system information, specific to device
	 * @readonly
	 * @type {object}
	 * @property {boolean} bluetoothAvailable - True if bluetooth is available on device
	 * @property {string} carrierName - Name of carrier
	 * @property {boolean} coreNaviButton - True if physical core navi button available on device
	 * @property {boolean} keyboardAvailable - True if physical keyboard available on device
	 * @property {boolean} keyboardSlider - True if keyboard slider available on device
	 * @property {string} keyboardType - Keyboard type
	 * @property {number} maximumCardWidth - Maximum card width in pixels
	 * @property {number} maximumCardHeight - Maximum card height in pixels
	 * @property {number} minimumCardWidth - Minimum card width in pixels
	 * @property {number} minimumCardHeight - Minimum card height in pixels
	 * @property {string} modelName - Model name of device in UTF-8 format
	 * @property {string} modelNameAscii - Model name of device in ASCII format
	 * @property {string} platformVersion - Full OS version string in the form "Major.Minor.Dot.Sub"
	 * @property {number} platformVersionDot - Subset of OS version string: Dot version number
	 * @property {number} platformVersionMajor - Subset of OS version string: Major version number
	 * @property {number} platformVersionMinor - Subset of OS version string: Minor version number
	 * @property {number} screenWidth - Width in pixels
	 * @property {number} screenHeight - Height in pixels
	 * @property {string} serialNumber - Device serial number
	 * @property {number} touchableRows - Number of rows
	 * @property {boolean} wifiAvailable - True if WiFi available on device
	 */
	webOS.device = deviceInfo;
} catch(e) {
	webOS.device = {}
}
